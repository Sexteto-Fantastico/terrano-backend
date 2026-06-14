import * as ProductTrackingRepository
    from "../repositories/product-tracking.repository";

import { Movement }
    from "../infra/entities/movement.entity";

function getMovementUnitCost(movement: Movement): number {
    const purchaseItem =
        movement.movement_entry?.purchase?.items?.find(
            item => item.product.id === movement.product.id
        );

    return (
        movement.unit_cost ??
        purchaseItem?.unit_price ??
        0
    );
}

export async function getProductTracking(
    productId: number
) {
    const movements =
        await ProductTrackingRepository.findByProduct(
            productId
        );

const totalCost =
    movements.reduce(
        (acc, movement) =>
            acc +
            (
                getMovementUnitCost(movement)
                * movement.quantity
            ),
        0
    );

    const totalQuantity =
        movements.reduce(
            (
                acc: number,
                movement: Movement
            ) =>
                acc +
                movement.quantity,
            0
        );

    const averageCost =
        totalQuantity > 0
            ? totalCost /
              totalQuantity
            : 0;

    return {
        productId,

        averageCost,

        periodAverageCost:
            averageCost,

      movements: movements.map(
    (movement: Movement) => {

        const unitCost =
            getMovementUnitCost(
                movement
            );

        return {
            id: movement.id,

            date:
                movement.created_at,

            type:
                movement.movement_entry
                    ? "IN"
                    : "OUT",

            quantity:
                movement.quantity,

            unitCost,

            total:
                unitCost *
                movement.quantity,

            purpose:
                movement
                    .movement_exit
                    ?.exitMovementCategory ??
                movement
                    .movement_entry
                    ?.entryMovementCategory ??
                null,
        };
    }
),
    };
}