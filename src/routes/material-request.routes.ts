import { Router } from "express";
import { z } from "zod";

import {
    createMaterialRequest,
    getMaterialRequests,
    getMaterialRequestById,
    updateMaterialRequest,
    deleteMaterialRequest,
} from "../controllers/material-request.controller";

import {
    CreateMaterialRequestBodySchema,
    UpdateMaterialRequestBodySchema,
    MaterialRequestResponseSchema,
    materialRequestIdSchema,
    materialRequestQuerySchema,
} from "../dtos/material-request.dto";

import {
    Endpoints,
    HttpMethod,
    ContentType
} from "../utils/constants/endpoints";

import { createRoute } from "../utils/route-builder";

const router = Router();

createRoute(router, {
    method: HttpMethod.POST,
    path: Endpoints.MATERIAL_REQUESTS.CREATE,
    basePath: Endpoints.MATERIAL_REQUESTS.BASE,
    tags: ["Material Requests"],
    summary: "Create a new material request",
    request: {
        body: {
            content: {
                [ContentType.JSON]: {
                    schema: CreateMaterialRequestBodySchema
                }
            }
        }
    },
    responses: {
        201: {
            description: "The created material request",
            content: {
                [ContentType.JSON]: {
                    schema: MaterialRequestResponseSchema
                }
            }
        }
    }
}, createMaterialRequest);

createRoute(router, {
    method: HttpMethod.GET,
    path: Endpoints.MATERIAL_REQUESTS.GET_ALL,
    basePath: Endpoints.MATERIAL_REQUESTS.BASE,
    tags: ["Material Requests"],
    summary: "Returns the list of material requests",
    request: {
        query: materialRequestQuerySchema.shape.query
    },
    responses: {
        200: {
            description: "The list of material requests",
            content: {
                [ContentType.JSON]: {
                    schema: z.array(MaterialRequestResponseSchema)
                }
            }
        }
    }
}, getMaterialRequests);

createRoute(router, {
    method: HttpMethod.GET,
    path: Endpoints.MATERIAL_REQUESTS.GET_BY_ID,
    basePath: Endpoints.MATERIAL_REQUESTS.BASE,
    tags: ["Material Requests"],
    summary: "Get material request by id",
    request: {
        params: materialRequestIdSchema.shape.params
    },
    responses: {
        200: {
            description: "The material request",
            content: {
                [ContentType.JSON]: {
                    schema: MaterialRequestResponseSchema
                }
            }
        },
        404: {
            description: "Material request not found"
        }
    }
}, getMaterialRequestById);

createRoute(router, {
    method: HttpMethod.PUT,
    path: Endpoints.MATERIAL_REQUESTS.UPDATE,
    basePath: Endpoints.MATERIAL_REQUESTS.BASE,
    tags: ["Material Requests"],
    summary: "Update a material request",
    request: {
        params: materialRequestIdSchema.shape.params,
        body: {
            content: {
                [ContentType.JSON]: {
                    schema: UpdateMaterialRequestBodySchema
                }
            }
        }
    },
    responses: {
        200: {
            description: "The updated material request",
            content: {
                [ContentType.JSON]: {
                    schema: MaterialRequestResponseSchema
                }
            }
        },
        404: {
            description: "Material request not found"
        }
    }
}, updateMaterialRequest);

createRoute(router, {
    method: HttpMethod.DELETE,
    path: Endpoints.MATERIAL_REQUESTS.DELETE,
    basePath: Endpoints.MATERIAL_REQUESTS.BASE,
    tags: ["Material Requests"],
    summary: "Cancel a material request",
    request: {
        params: materialRequestIdSchema.shape.params
    },
    responses: {
        204: {
            description: "Material request cancelled successfully"
        },
        404: {
            description: "Material request not found"
        }
    }
}, deleteMaterialRequest);

export default router;