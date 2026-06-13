import { AppDataSource } from "../config/data-source";
import { Role } from "../entities/role.entity";
import { Policy } from "../entities/policy.entity";

export async function createRolePoliciesSeed(): Promise<void> {
    const roleRepository = AppDataSource.getRepository(Role);
    const policyRepository = AppDataSource.getRepository(Policy);

    const adminRole = await roleRepository.findOne({
        where: { name: "ADMIN" },
        relations: ["policies"],
    });

    if (!adminRole) {
        console.warn("Role ADMIN not found. Run role seed first.");
        return;
    }

    const allPolicies = await policyRepository.find();

    if (allPolicies.length === 0) {
        console.warn("No policies found. Run policy seed first.");
        return;
    }

    const existingPolicyIds = new Set(adminRole.policies.map((p) => p.id));
    const newPolicies = allPolicies.filter((p) => !existingPolicyIds.has(p.id));

    if (newPolicies.length === 0) {
        console.log("ADMIN role already has all policies. Skipping.");
        return;
    }

    adminRole.policies = [...adminRole.policies, ...newPolicies];
    await roleRepository.save(adminRole);

    console.log(`Role policies seed completed. Added ${newPolicies.length} policies to ADMIN.`);
}