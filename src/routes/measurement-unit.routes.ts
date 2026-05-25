import { Router } from "express";
import { z } from "zod";
import { getAll, getById, create, update, remove, restore } from "../controllers/measurement-unit.controller";
import { Endpoints, HttpMethod, ContentType } from "../utils/constants/endpoints";
import { createRoute } from "../utils/route-builder";
import {
    measurementUnitQuerySchema,
    CreateMeasurementUnitBodySchema,
    UpdateMeasurementUnitBodySchema,
    measurementUnitIdSchema,
    MeasurementUnitResponseSchema
} from "../dtos/measurement-unit.dto";

const router = Router();

createRoute(router, {
    method: HttpMethod.GET,
    path: Endpoints.MEASUREMENT_UNITS.GET_ALL,
    basePath: Endpoints.MEASUREMENT_UNITS.BASE,
    tags: ["Measurement Units"],
    summary: "Retrieve a list of measurement units",
    request: {
        query: measurementUnitQuerySchema.shape.query
    },
    responses: {
        200: {
            description: "A list of measurement units",
            content: { [ContentType.JSON]: { schema: z.array(MeasurementUnitResponseSchema) } }
        }
    },
}, getAll);

createRoute(router, {
    method: HttpMethod.GET,
    path: Endpoints.MEASUREMENT_UNITS.GET_BY_ID,
    basePath: Endpoints.MEASUREMENT_UNITS.BASE,
    tags: ["Measurement Units"],
    summary: "Get a measurement unit by ID",
    request: {
        params: measurementUnitIdSchema.shape.params
    },
    responses: {
        200: {
            description: "Measurement unit details",
            content: { [ContentType.JSON]: { schema: MeasurementUnitResponseSchema } }
        },
        404: { description: "Measurement unit not found" }
    }
}, getById);

createRoute(router, {
    method: HttpMethod.POST,
    path: Endpoints.MEASUREMENT_UNITS.CREATE,
    basePath: Endpoints.MEASUREMENT_UNITS.BASE,
    tags: ["Measurement Units"],
    summary: "Create a new measurement unit",
    request: {
        body: { content: { [ContentType.JSON]: { schema: CreateMeasurementUnitBodySchema } } }
    },
    responses: {
        201: {
            description: "The created measurement unit",
            content: { [ContentType.JSON]: { schema: MeasurementUnitResponseSchema } }
        },
        409: { description: "Measurement unit with the given name already exists" }
    }
}, create);

createRoute(router, {
    method: HttpMethod.PUT,
    path: Endpoints.MEASUREMENT_UNITS.UPDATE,
    basePath: Endpoints.MEASUREMENT_UNITS.BASE,
    tags: ["Measurement Units"],
    summary: "Update an existing measurement unit",
    request: {
        params: measurementUnitIdSchema.shape.params,
        body: { content: { [ContentType.JSON]: { schema: UpdateMeasurementUnitBodySchema } } }
    },
    responses: {
        200: {
            description: "The updated measurement unit",
            content: { [ContentType.JSON]: { schema: MeasurementUnitResponseSchema } }
        },
        404: { description: "Measurement unit not found" },
        409: { description: "Measurement unit with the given name already exists" }
    }
}, update);

createRoute(router, {
    method: HttpMethod.DELETE,
    path: Endpoints.MEASUREMENT_UNITS.DELETE,
    basePath: Endpoints.MEASUREMENT_UNITS.BASE,
    tags: ["Measurement Units"],
    summary: "Deactivate a measurement unit (soft delete)",
    request: {
        params: measurementUnitIdSchema.shape.params
    },
    responses: {
        204: { description: "Successfully deactivated" },
        400: { description: "Measurement unit is already deactivated" },
        404: { description: "Measurement unit not found" }
    }
}, remove);

createRoute(router, {
    method: HttpMethod.POST,
    path: Endpoints.MEASUREMENT_UNITS.RESTORE,
    basePath: Endpoints.MEASUREMENT_UNITS.BASE,
    tags: ["Measurement Units"],
    summary: "Restore a deactivated measurement unit",
    request: {
        params: measurementUnitIdSchema.shape.params
    },
    responses: {
        200: {
            description: "Successfully restored",
            content: { [ContentType.JSON]: { schema: MeasurementUnitResponseSchema } }
        },
        400: { description: "Measurement unit is not deactivated" },
        404: { description: "Measurement unit not found" }
    }
}, restore);

export default router;
