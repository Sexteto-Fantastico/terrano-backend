import { Router } from "express";
import { z } from "zod";
import { getAllPolicies } from "../controllers/policy.controller";
import { Endpoints, HttpMethod, ContentType } from "../utils/constants/endpoints";
import { createRoute } from "../utils/route-builder";
import { PolicyResponseSchema } from "../dtos/role.dto";

const router = Router();

createRoute(router, {
    method: HttpMethod.GET,
    path: Endpoints.POLICIES.GET_ALL,
    basePath: Endpoints.POLICIES.BASE,
    tags: ["Policies"],
    summary: "List all available policies",
    permissions: { resource: "USER", action: "READ" },
    responses: {
        200: {
            description: "The list of policies",
            content: { [ContentType.JSON]: { schema: z.array(PolicyResponseSchema) } }
        }
    },
}, getAllPolicies);

export default router;
