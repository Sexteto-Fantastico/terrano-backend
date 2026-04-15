import { ILogger, LogEntry } from "./logger.interface";
import { SystemLog } from "../entities/system-log.entity";
import { AppDataSource } from "../config/data-source";

const logRepository = AppDataSource.getRepository(SystemLog);

export class DatabaseLogger implements ILogger {
    log(entry: LogEntry): void {
        const log = new SystemLog();

        log.level = entry.level;
        log.message = entry.message.substring(0, 1000);
        log.status_code = entry.statusCode;
        log.is_operational = entry.isOperational;
        log.stack = entry.stack;
        log.path = entry.path;
        log.method = entry.method;
        log.metadata = entry.metadata;

        logRepository.save(log).catch((saveError: Error) => {
            console.error("[DatabaseLogger] Failed to persist log to database:", {
                saveError: saveError.message,
                originalLog: {
                    level: entry.level,
                    message: entry.message,
                    statusCode: entry.statusCode,
                    isOperational: entry.isOperational,
                    path: entry.path,
                    method: entry.method,
                    stack: entry.stack,
                },
            });
        });
    }
}
