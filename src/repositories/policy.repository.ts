import { AppDataSource } from "../infra/config/data-source";
import { Policy } from "../infra/entities/policy.entity";

const policyRepository = AppDataSource.getRepository(Policy);

async function getAllPolicies(): Promise<Policy[]> {
    return await policyRepository.find();
}

async function getPolicyById(id: number): Promise<Policy | null> {
    return await policyRepository.findOne({ where: { id } });
}

async function getPoliciesByIds(ids: number[]): Promise<Policy[]> {
    return await policyRepository.findByIds(ids);
}

export { getAllPolicies, getPolicyById, getPoliciesByIds };
