import { AppDataSource } from "../config/data-source";
import { SystemLog } from "../entities/system-log.entity";

export async function createSystemLogSeed(): Promise<void> {

    const repository =
        AppDataSource.getRepository(SystemLog);

    if (await repository.count()) {
        return;
    }

    const entities = [
        "PRODUCT",
        "PURCHASE",
        "USER",
        "REQUISITION",
        "STOCK",
    ];

    const actions = [
        "CREATE",
        "UPDATE",
        "DELETE",
        "APPROVE",
        "LOGIN",
    ];

    const logs: SystemLog[] = [];

    for (let i = 0; i < 100; i++) {

        logs.push(
            repository.create({
                entity_name:
                    entities[Math.floor(Math.random() * entities.length)],
                entity_id:
                    Math.floor(Math.random() * 100),
                action:
                    actions[Math.floor(Math.random() * actions.length)],
                user_id:
                    Math.floor(Math.random() * 10) + 1,
                metadata: {
                    seed: true,
                },
            })
        );
    }

    await repository.save(logs);

    console.log("SystemLog seed completed");
}