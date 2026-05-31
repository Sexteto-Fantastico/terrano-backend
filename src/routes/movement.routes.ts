import { Router } from "express";
import { Endpoints, HttpMethod, ContentType } from "../utils/constants/endpoints";
import { createRoute } from "../utils/route-builder";
import { createMovementExit } from "../controllers/movement.controller";
import { CreateMovementExitBodySchema, MovementExitResponseSchema } from "../dtos/movement.dto";

const router = Router();

createRoute(router, {
    method: HttpMethod.POST,
    path: Endpoints.MOVEMENTS.EXIT,
    basePath: Endpoints.MOVEMENTS.BASE,
    tags: ["Movements"],
    summary: "Create a direct stock exit movement (e.g. for defective/broken items or manual adjustment)",
    request: {
        body: { content: { [ContentType.JSON]: { schema: CreateMovementExitBodySchema } } }
    },
    responses: {
        201: {
            description: "Created successfully",
            content: {
                [ContentType.JSON]: {
                    schema: MovementExitResponseSchema
                }
            }
        },
        400: { description: "Validation error or insufficient stock" },
        404: { description: "Product or stock location not found" },
    },
}, createMovementExit);

export default router;
