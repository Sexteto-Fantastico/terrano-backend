import { ErrorLog } from "../entities/error-log.entity";
import { LogLevel } from "../logger/logger.interface";

export async function createErrorLogSeed(): Promise<void> {

    const count = await ErrorLog.count();

    if (count > 0) {
        return;
    }

    const errors = [
        "Unauthorized",
        "Product not found",
        "Database timeout",
        "Purchase validation failed",
        "Invalid stock movement",
        "JWT token expired",
        "Insufficient stock",
    ];

    for (let i = 0; i < 30; i++) {

        const log = ErrorLog.create({
            level: LogLevel.ERROR,
            message:
                errors[Math.floor(Math.random() * errors.length)],
            status_code:
                [400, 401, 403, 404, 500][
                    Math.floor(Math.random() * 5)
                ],
            is_operational: true,
            path: "/api/test",
            method: "GET",
            metadata: {
                seed: true,
            },
        });

        await log.save();
    }

    console.log("ErrorLog seed completed");
}