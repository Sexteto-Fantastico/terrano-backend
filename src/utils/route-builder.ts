import { Router, RequestHandler } from "express";
import { ZodType } from "zod";
import { z, registry } from "../infra/config/openapi";
import { asyncHandler } from "./async-handler";
import { validateRequest } from "../middlewares/validate.middleware";

import { HttpMethod } from "./constants/endpoints";

type OpenAPIRouteConfig = Parameters<typeof registry.registerPath>[0];

export interface RouteConfig extends Omit<OpenAPIRouteConfig, "path" | "method"> {
    method: HttpMethod;
    path: string;
    basePath?: string;
    middlewares?: RequestHandler[];
}

export function createRoute(
    router: Router,
    config: RouteConfig,
    handler: RequestHandler<any>
) {
    const { path, basePath = "", middlewares = [], method, ...openApiConfig } = config;

    const normalizedPath = (path === "/" && basePath) ? "" : path;
    const fullPath = `${basePath}${normalizedPath}`;
    const openApiPath = fullPath.replace(/:([a-zA-Z0-9_]+)/g, "{$1}");

    registry.registerPath({
        ...openApiConfig,
        method,
        path: openApiPath,
    });

    const handlers: RequestHandler[] = [];

    if (middlewares.length > 0) {
        handlers.push(...middlewares);
    }

    if (config.request) {
        const schemaParts: Record<string, ZodType<any, any, any>> = {};

        if (config.request.params) {
            schemaParts.params = config.request.params as ZodType<any, any, any>;
        }
        if (config.request.query) {
            schemaParts.query = config.request.query as ZodType<any, any, any>;
        }

        const bodyContent = config.request.body?.content;
        if (bodyContent) {
            const firstContentType = Object.keys(bodyContent)[0];
            if (firstContentType && bodyContent[firstContentType]?.schema) {
                schemaParts.body = bodyContent[firstContentType].schema as ZodType<any, any, any>;
            }
        }

        if (Object.keys(schemaParts).length > 0) {
            handlers.push(validateRequest(z.object(schemaParts)));
        }
    }

    handlers.push(asyncHandler(handler));
    router[method](path, ...handlers);
}