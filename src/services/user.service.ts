import { User } from "../infra/entities/user.entity";
import { hashPassword } from "../utils/password.util";
import { formatCpf, isValidCpf, cleanCpf } from "../utils/cpf.util";
import {
    ChangePasswordBody,
    CreateUserBody,
    UserQuery,
    UpdateUserBody,
    UserResponse,
    toUserResponse,
    toUserResponseList,
    UserPermissionsResponse,
    toUserPermissionsResponse,
} from "../dtos/user.dto";
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError } from "../errors";
import { createUser as repoCreateUser, getUserByUsername, getUserByEmail, getUserById as repoGetUserById, getAllUsers, updateUser as repoUpdateUser, deleteUser as repoDeleteUser, recoverUser as repoRecoverUser, getUserWithPermissions } from "../repositories/user.repository";
import { getRoleById, getRoleWithPolicies } from "../repositories/role.repository";
import { revokeAllUserRefreshTokens } from "../repositories/refresh-token.repository";
import { countActiveUsersByRoleName } from "../repositories/user.repository";
import { getDepartmentById } from "../repositories/department.repository";

const ADMIN_ROLE_NAME = "ADMIN";

async function getActorPolicyIds(actorId: number): Promise<{ policyIds: Set<number>; isAdmin: boolean }> {
    const actor = await getUserWithPermissions(actorId);
    if (!actor?.role) {
        throw new ForbiddenError("User not authenticated.");
    }
    return {
        policyIds: new Set(actor.role.policies.map((policy) => policy.id)),
        isAdmin: actor.role.name === ADMIN_ROLE_NAME,
    };
}

// Nobody can hand out a role that carries permissions they do not hold themselves.
async function assertCanAssignRole(actorId: number, roleId: number): Promise<void> {
    const { policyIds } = await getActorPolicyIds(actorId);
    const role = await getRoleWithPolicies(roleId);
    if (!role) {
        throw new NotFoundError("Role not found.");
    }
    if (role.policies.some((policy) => !policyIds.has(policy.id))) {
        throw new ForbiddenError("You cannot assign a role with more permissions than your own.");
    }
}

async function assertCanManageTarget(actorId: number, target: User): Promise<void> {
    if (target.role?.name !== ADMIN_ROLE_NAME) {
        return;
    }
    const { isAdmin } = await getActorPolicyIds(actorId);
    if (!isAdmin) {
        throw new ForbiddenError("Only administrators can manage administrator accounts.");
    }
}

async function invalidateUserSessions(user: User): Promise<void> {
    user.token_version = (user.token_version ?? 0) + 1;
    await revokeAllUserRefreshTokens(user.id);
}

async function createUser(request: CreateUserBody, actorId: number): Promise<UserResponse> {
    const existingUser = await getUserByUsername(request.username);
    if (existingUser) {
        throw new ConflictError("Username already exists.");
    }

    const existingEmail = await getUserByEmail(request.email);
    if (existingEmail) {
        throw new ConflictError("Email already exists.");
    }

    const role = await getRoleById(request.roleId);
    if (!role) {
        throw new NotFoundError("Role not found.");
    }
    await assertCanAssignRole(actorId, role.id);

    const department = await getDepartmentById(request.departmentId);
    if (!department) {
        throw new NotFoundError("Department not found.");
    }

    let cpfValue: string | undefined;
    if (request.cpf !== undefined && request.cpf !== null && request.cpf !== "") {
        const cleanedCpf = cleanCpf(request.cpf);
        if (!isValidCpf(cleanedCpf)) {
            throw new BadRequestError("Invalid CPF.");
        }
        cpfValue = formatCpf(cleanedCpf);
    }

    const user = new User({
        name: request.name,
        phone: request.phone,
        cpf: cpfValue,
        email: request.email,
        username: request.username,
        password: await hashPassword(request.password),
        role,
        department,
        requires_password_reset: request.requiresPasswordReset ?? false,
        created_by: actorId,
        updated_by: actorId,
    });

    await repoCreateUser(user);
    return toUserResponse(user);
}

async function getUsers(filters: UserQuery): Promise<[UserResponse[], number]> {
    const [users, total] = await getAllUsers(filters);
    return [toUserResponseList(users), total];
}

async function getUserById(id: number): Promise<UserResponse> {
    const user = await repoGetUserById(id);

    if (!user) {
        throw new NotFoundError("User not found.");
    }

    return toUserResponse(user);
}

async function updateUser(id: number, request: UpdateUserBody, actorId: number): Promise<UserResponse> {
    const user = await repoGetUserById(id);
    if (!user) {
        throw new NotFoundError("User not found.");
    }
    await assertCanManageTarget(actorId, user);

    if (request.username && request.username !== user.username) {
        const existingUser = await getUserByUsername(request.username);
        if (existingUser && existingUser.id !== user.id) {
            throw new ConflictError("Username already exists.");
        }
        user.username = request.username;
    }

    if (request.name !== undefined) {
        user.name = request.name;
    }

    if (request.phone !== undefined) {
        user.phone = request.phone;
    }

    if (request.cpf !== undefined) {
        if (request.cpf === null || request.cpf === "") {
            user.cpf = undefined;
        } else {
            const cleanedCpf = cleanCpf(request.cpf);
            if (!isValidCpf(cleanedCpf)) {
                throw new BadRequestError("Invalid CPF.");
            }
            user.cpf = formatCpf(cleanedCpf);
        }
    }

    if (request.email !== undefined) {
        if (request.email !== user.email) {
            const existingEmail = await getUserByEmail(request.email);
            if (existingEmail && existingEmail.id !== user.id) {
                throw new ConflictError("Email already exists.");
            }
        }
        user.email = request.email;
    }
 
    if ("password" in request) {
        throw new BadRequestError("Use the dedicated password route to update the password.");
    }

    if (request.roleId !== undefined && request.roleId !== user.role?.id) {
        if (user.id === actorId) {
            throw new ForbiddenError("You cannot change your own role.");
        }
        const role = await getRoleById(request.roleId);
        if (!role) {
            throw new NotFoundError("Role not found.");
        }
        await assertCanAssignRole(actorId, role.id);
        user.role = role;
        await invalidateUserSessions(user);
    }

    if (request.departmentId !== undefined) {
        const department = await getDepartmentById(request.departmentId);
        if (!department) {
            throw new NotFoundError("Department not found.");
        }
        user.department = department;
    }

    user.updated_by = actorId;

    await repoUpdateUser(user);
    return toUserResponse(user);
}

async function changePassword(id: number, request: ChangePasswordBody, actorId: number): Promise<UserResponse> {
    if (id === actorId) {
        throw new BadRequestError("Use the account password change to update your own password.");
    }

    const user = await repoGetUserById(id);
    if (!user) {
        throw new NotFoundError("User not found.");
    }
    await assertCanManageTarget(actorId, user);

    // An administrator-set password is temporary: the owner must choose a new one at the next login.
    user.password = await hashPassword(request.password);
    user.requires_password_reset = true;
    user.password_reset_token = undefined;
    user.password_reset_token_expires_at = undefined;
    user.updated_by = actorId;
    await invalidateUserSessions(user);

    await repoUpdateUser(user);
    return toUserResponse(user);
}

async function deleteUser(id: number, actorId: number): Promise<UserResponse> {
    if (id === actorId) {
        throw new ForbiddenError("You cannot delete your own account.");
    }

    const user = await repoGetUserById(id);
    if (!user) {
        throw new NotFoundError("User not found.");
    }
    await assertCanManageTarget(actorId, user);

    if (user.role?.name === ADMIN_ROLE_NAME && (await countActiveUsersByRoleName(ADMIN_ROLE_NAME)) <= 1) {
        throw new ForbiddenError("The last administrator cannot be deleted.");
    }

    user.updated_by = actorId;
    await invalidateUserSessions(user);
    await repoUpdateUser(user);
    await repoDeleteUser(user);
    return toUserResponse(user);
}

async function restoreUser(id: number, actorId: number): Promise<UserResponse> {
    const user = await repoGetUserById(id, true);
    if (!user) {
        throw new NotFoundError("User not found.");
    }

    if (!user.deleted_at) {
        throw new BadRequestError("User is not deleted.");
    }

    await assertCanManageTarget(actorId, user);

    user.updated_by = actorId;
    await repoRecoverUser(user);
    return toUserResponse(user);
}

async function updateProfilePicture(id: number, filePath: string): Promise<UserResponse> {
    const user = await repoGetUserById(id);
    if (!user) {
        throw new NotFoundError("User not found.");
    }

    user.profile_picture = filePath;
    await repoUpdateUser(user);
    return toUserResponse(user);
}

async function getUserPermissions(userId: number): Promise<UserPermissionsResponse> {
    const user = await getUserWithPermissions(userId);

    if (!user) throw new NotFoundError("User not found");
    if (!user.role) throw new NotFoundError("User has no role assigned");

    return toUserPermissionsResponse(user.role.policies);
}

export { createUser, getUsers, getUserById, updateUser, changePassword, deleteUser, restoreUser, updateProfilePicture, getUserPermissions };
