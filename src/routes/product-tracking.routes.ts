import { Router } from "express";
import { createRoute } from "../utils/route-builder";
import {
  HttpMethod,
  ContentType,
  Endpoints,
} from "../utils/constants/endpoints";

import {
  ProductTrackingQuerySchema,
  ProductTrackingResponseSchema,
} from "../dtos/product-tracking.dto";

import {
  getProductTracking,
} from "../controllers/product-tracking.controller";

const router = Router();

createRoute(
  router,
  {
    method: HttpMethod.GET,

    path: Endpoints.PRODUCT_TRACKING.GET_REPORT,

    basePath: Endpoints.PRODUCT_TRACKING.BASE,

    tags: ["Product Tracking"],

    summary: "Product movement tracking report",

    request: {
      query: ProductTrackingQuerySchema.shape.query,
    },

    responses: {
      200: {
        description: "Tracking report",
        content: {
          [ContentType.JSON]: {
            schema: ProductTrackingResponseSchema,
          },
        },
      },
    },
  },
  getProductTracking
);

export default router;