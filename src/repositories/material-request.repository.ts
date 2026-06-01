import { AppDataSource } from "../infra/config/data-source";
import { MaterialRequest } from "../infra/entities/material-request.entity";

const repository =
    AppDataSource.getRepository(MaterialRequest);

async function getMaterialRequests(filters = {}) {
    return repository.findAndCount({
        relations: {
            items: true,
        },
        order: {
            created_at: "DESC",
        },
    });
}

async function getMaterialRequestById(id: number) {
    return repository.findOne({
        where: { id },
        relations: {
            items: true,
        },
    });
}

async function saveMaterialRequest(
    request: Partial<MaterialRequest>
) {
    return repository.save(
        repository.create(request)
    );
}

async function updateMaterialRequest(
    request: MaterialRequest
) {
    return repository.save(request);
}

async function deleteMaterialRequest(id: number) {
    const result = await repository.softDelete(id);
    return result.affected === 1;
}

export {
    getMaterialRequests,
    getMaterialRequestById,
    saveMaterialRequest,
    updateMaterialRequest,
    deleteMaterialRequest,
};