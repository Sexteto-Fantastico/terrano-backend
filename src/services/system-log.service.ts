import { SystemLogRepository } from "../repositories/system-log.repository";

export class SystemLogService {

    async getLogs(entity: string, entityId?: number) {
        const query = SystemLogRepository.createQueryBuilder("log")
            .where("log.entity_name = :entity", { entity });

        if (entityId) {
            query.andWhere("log.entity_id = :entityId", { entityId });
        }

        return query
            .orderBy("log.created_at", "DESC")
            .getMany();
    }
}