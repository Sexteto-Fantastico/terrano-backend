import { AppDataSource } from "../infra/config/data-source";
import { SystemLog } from "../infra/entities/system-log.entity";

export const SystemLogRepository = AppDataSource.getRepository(SystemLog);
