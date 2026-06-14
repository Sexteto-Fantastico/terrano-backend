import {
    PolicyResponse,
    toPolicyResponseList,
} from "../dtos/role.dto";
import {
    getAllPolicies as repoGetAllPolicies,
} from "../repositories/policy.repository";

async function getAllPolicies(): Promise<PolicyResponse[]> {
    const policies = await repoGetAllPolicies();
    return toPolicyResponseList(policies);
}

export { getAllPolicies };
