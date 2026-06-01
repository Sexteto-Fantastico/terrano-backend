import { Router } from "express";
import { z } from "zod";
import { Endpoints, HttpMethod, ContentType } from "../utils/constants/endpoints";
import { createRoute } from "../utils/route-builder";
import { 
    createMovementExit,
    createMovementEntry,
    getMovementEntries,
    getMovementEntryById
} from "../controllers/movement.controller";
import { 
    CreateMovementExitBodySchema, 
    MovementExitResponseSchema,
    CreateMovementEntryBodySchema,
    MovementEntryResponseSchema,
    MovementEntryIdSchema,
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
    method: HttpMethod.POST,
    path: Endpoints.MOVEMENTS.ENTRY,
    basePath: Endpoints.MOVEMENTS.BASE,
    tags: ["Movements"],
    summary: "Create a direct stock entry movement (e.g. for purchases or manual adjustment)",
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
}, getMovementEntries);

createRoute(router, {
    method: HttpMethod.GET,
    path: Endpoints.MOVEMENTS.ENTRY_GET_BY_ID, // Usando a constante ao invés de template string
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
    }
}, getMovementEntryById);

export default router;