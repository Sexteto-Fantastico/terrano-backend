import { SystemLogRepository } from "../repositories/system-log.repository";

async function getEntityLogs(entityName: string, entityId: number) {
  return await SystemLogRepository.find({
    where: {
      entity_name: entityName,
      entity_id: entityId,
    },
    relations: ["user"],
    order: {
      created_at: "DESC",
    },
  });
}

export { getEntityLogs };
