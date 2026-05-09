export class RoleDto {
    id!: number;
    name!: string;
}

export class DepartmentDto {
    id!: number;
    name!: string;
}

export class UserResponseDto {
    id!: number;
    name!: string;
    phone?: string;
    cpf?: string;
    email!: string;
    username!: string;
    role?: RoleDto;
    department?: DepartmentDto;
    managedDepartments: DepartmentDto[] = [];
    isActive!: boolean;
    requiresPasswordReset?: boolean;
}

export class CreateUserRequestDto {
    name!: string;
    phone?: string;
    cpf?: string;
    email!: string;
    username!: string;
    password!: string;
    roleId?: number;
    departmentId?: number;
    requiresPasswordReset?: boolean;
    updatedBy?: number;
}

export class UpdateUserRequestDto {
    name?: string;
    phone?: string;
    cpf?: string;
    email?: string;
    username?: string;
    roleId?: number;
    departmentId?: number;
    updatedBy?: number;
}

export class ChangePasswordRequestDto {
    password!: string;
    updatedBy?: number;
}

export class DeleteUserRequestDto {
    updatedBy?: number;
}

export class GetUsersQueryDto {
    name?: string;
    onlyActive?: string | boolean;
}

export class LoginRequestDto {
    email!: string;
    password!: string;
}

export class LoginResponseDto {
    token!: string;
    expiresAt!: string;
    mustResetPassword?: boolean;
}

export class ForgotPasswordRequestDto {
    email!: string;
}

export class ResetPasswordRequestDto {
    token!: string;
    password!: string;
}

export class DefinePasswordRequestDto {
    password!: string;
}
