import { AppDataSource } from "../infra/config/data-source";

import { Movement }
    from "../infra/entities/movement.entity";

const repository =
    AppDataSource.getRepository(
        Movement
    );

export async function findByProduct(
    productId: number
) {
    return repository.find({
        where: {
            product: {
                id: productId,
            },
        },

        relations: {
    product: true,

    movement_entry: {
        purchase: {
            items: {
                product: true,
            },
        },
    },

    movement_exit: true,
},

        order: {
            created_at: "ASC",
        },
    });
}