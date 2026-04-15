export enum LogLevel {
    INFO = "INFO",
    WARN = "WARN",
    ERROR = "ERROR",
    FATAL = "FATAL",
}

export interface LogEntry {
    level: LogLevel;

    message: string;

    statusCode: number;

    isOperational: boolean;

    stack?: string;

    path?: string;

    method?: string;

    metadata?: Record<string, unknown>;
}

export interface ILogger {
    log(entry: LogEntry): void;
}
