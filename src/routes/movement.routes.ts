import { Router } from "express";
import { z } from "zod";
import { Endpoints, HttpMethod, ContentType } from "../utils/constants/endpoints";
import { createRoute } from "../utils/route-builder";
import {
    createMovementExit,
    createMovementEntry,
    getMovementEntries,
    getMovementEntryById,
    getMovementExits,
    getMovementExitById,
    deleteMovementExit,
    deleteMovementEntry,
} from "../controllers/movement.controller";
import {
    CreateMovementExitBodySchema,
    MovementExitResponseSchema,
    MovementExitIdSchema,
    CreateMovementEntryBodySchema,
    MovementEntryResponseSchema,
    MovementEntryIdSchema,
    MovementExitQuerySchema,
    MovementEntryQuerySchema,
} from "../dtos/movement.dto";

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
            description: "Exit movement created successfully",
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

createRoute(router, {
    method: HttpMethod.GET,
    path: Endpoints.MOVEMENTS.EXIT,
    basePath: Endpoints.MOVEMENTS.BASE,
    tags: ["Movements"],
    summary: "List all stock exit movements",
    request: {
        query: MovementExitQuerySchema.shape.query
    },
    responses: {
        200: {
            description: "List of exit movements",
            content: {
                [ContentType.JSON]: {
                    schema: z.array(MovementExitResponseSchema)
                }
            }
        }
    },
    permissions: { resource: "MOVEMENT_EXIT", action: "READ" },
}, getMovementExits);

createRoute(router, {
    method: HttpMethod.GET,
    path: Endpoints.MOVEMENTS.EXIT_GET_BY_ID,
    basePath: Endpoints.MOVEMENTS.BASE,
    tags: ["Movements"],
    summary: "Get a specific stock exit movement by ID",
    request: {
        params: MovementExitIdSchema.shape.params
    },
    responses: {
        200: {
            description: "Exit movement details",
            content: { [ContentType.JSON]: { schema: MovementExitResponseSchema } }
        },
        400: { description: "Invalid ID format" },
        404: { description: "Movement exit not found" }
    },
    permissions: { resource: "MOVEMENT_EXIT", action: "READ" },
}, getMovementExitById);

createRoute(router, {
    method: HttpMethod.DELETE,
    path: Endpoints.MOVEMENTS.EXIT_DELETE,
    permissions: { resource: "MOVEMENT_EXIT", action: "DELETE" },
    basePath: Endpoints.MOVEMENTS.BASE,
    tags: ["Movements"],
    summary: "Delete a specific stock exit movement by ID",
    request: {
        params: MovementExitIdSchema.shape.params
    },
    responses: {
        204: { description: "Exit movement deleted successfully" },
        400: { description: "Movement exit is already inactive or invalid ID format" },
        404: { description: "Movement exit not found" }
    }
}, deleteMovementExit);

createRoute(router, {
    method: HttpMethod.POST,
    path: Endpoints.MOVEMENTS.ENTRY,
    basePath: Endpoints.MOVEMENTS.BASE,
    tags: ["Movements"],
    summary: "Create a stock entry movement",
    request: {
        body: { content: { [ContentType.JSON]: { schema: CreateMovementEntryBodySchema } } }
    },
    responses: {
        201: {
            description: "Entry movement created successfully",
            content: {
                [ContentType.JSON]: {
                    schema: MovementEntryResponseSchema
                }
            }
        },
        400: { description: "Validation error or invalid quantity" },
        404: { description: "Product, stock location, or purchase not found" },
    },
}, createMovementEntry);

createRoute(router, {
    method: HttpMethod.GET,
    path: Endpoints.MOVEMENTS.ENTRY,
    basePath: Endpoints.MOVEMENTS.BASE,
    tags: ["Movements"],
    summary: "List all stock entry movements",
    request: {
        query: MovementEntryQuerySchema.shape.query
    },
    responses: {
        200: {
            description: "List of entry movements",
            content: {
                [ContentType.JSON]: {
                    schema: z.array(MovementEntryResponseSchema)
                }
            }
        }
    },
    permissions: { resource: "MOVEMENT_ENTRY", action: "READ" },
}, getMovementEntries);

createRoute(router, {
    method: HttpMethod.GET,
    path: Endpoints.MOVEMENTS.ENTRY_GET_BY_ID,
    basePath: Endpoints.MOVEMENTS.BASE,
    tags: ["Movements"],
    summary: "Get a specific stock entry movement by ID",
    request: {
        params: MovementEntryIdSchema.shape.params
    },
    responses: {
        200: {
            description: "Entry movement details",
            content: { [ContentType.JSON]: { schema: MovementEntryResponseSchema } }
        },
        400: { description: "Invalid ID format" },
        404: { description: "Movement entry not found" }
    },
    permissions: { resource: "MOVEMENT_ENTRY", action: "READ" },
}, getMovementEntryById);

createRoute(router, {
    method: HttpMethod.DELETE,
    path: Endpoints.MOVEMENTS.ENTRY_DELETE,
    permissions: { resource: "MOVEMENT_ENTRY", action: "DELETE" },
    basePath: Endpoints.MOVEMENTS.BASE,
    tags: ["Movements"],
    summary: "Inactivate a stock entry movement and revert stock balance",
    request: {
        params: MovementEntryIdSchema.shape.params
    },
    responses: {
        204: { description: "Entry movement inactivated successfully" },
        400: { description: "Entry is already inactive or has active returns" },
        404: { description: "Movement entry not found" }
    }
}, deleteMovementEntry);

export default router;
