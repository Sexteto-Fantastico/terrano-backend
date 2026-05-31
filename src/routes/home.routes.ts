import { Router } from "express";
import { Endpoints, HttpMethod, ContentType } from "../utils/constants/endpoints";
import { createRoute } from "../utils/route-builder";
import { HomeResponseSchema } from "../dtos/home.dto";
import { getHomeSummary } from "../controllers/home.controller";

const router = Router();

createRoute(router, {
    method: HttpMethod.GET,
    path: Endpoints.HOME.SUMMARY,
    basePath: Endpoints.HOME.BASE,
    tags: ["Home"],
    summary: "Returns the home page dashboard summary indicators",
    responses: {
        200: {
            description: "Home page dashboard summary indicators",
            content: {
                [ContentType.JSON]: {
                    schema: HomeResponseSchema
                }
            }
        }
    }
}, getHomeSummary);

export default router;
