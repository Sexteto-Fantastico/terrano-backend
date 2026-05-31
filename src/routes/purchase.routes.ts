import { Router } from "express";
import { Endpoints, HttpMethod, ContentType } from "../utils/constants/endpoints";
import { createRoute } from "../utils/route-builder";
import { z } from "zod";
import {
	purchaseIdSchema,
	purchaseQuerySchema,
	createpurchaseSchema,
	updatepurchaseSchema,
} from "../dtos/purchase.dto";
import { getAllPurchases, getPurchaseById, createPurchase, updatePurchase, deletePurchase, restorePurchase } from "../controllers/purchase.controller";

const router = Router();


createRoute(router, {
	method: HttpMethod.GET,
	path: Endpoints.PURCHASES.GET_ALL,
	basePath: Endpoints.PURCHASES.BASE,
	tags: ["Purchases"],
	summary: "Returns the list of all purchases",
	request: {
		query: purchaseQuerySchema.shape.query,
	},
	responses: {
		200: { description: "The list of purchases" },
	},
}, getAllPurchases);


createRoute(router, {
	method: HttpMethod.GET,
	path: Endpoints.PURCHASES.GET_BY_ID,
	basePath: Endpoints.PURCHASES.BASE,
	tags: ["Purchases"],
	summary: "Get a purchase by id",
	request: { params: purchaseIdSchema.shape.params },
	responses: { 200: { description: "The purchase" }, 404: { description: "Purchase not found" } },
}, getPurchaseById);

createRoute(router, {
	method: HttpMethod.POST,
	path: Endpoints.PURCHASES.CREATE,
	basePath: Endpoints.PURCHASES.BASE,
	tags: ["Purchases"],
	summary: "Create a purchase",
	request: { body: { content: { [ContentType.JSON]: { schema: createpurchaseSchema } } } },
	responses: { 201: { description: "Created" }, 400: { description: "Validation error" } },
}, createPurchase);

createRoute(router, {
	method: HttpMethod.PUT,
	path: Endpoints.PURCHASES.UPDATE,
	basePath: Endpoints.PURCHASES.BASE,
	tags: ["Purchases"],
	summary: "Update a purchase",
	request: { params: purchaseIdSchema.shape.params, body: { content: { [ContentType.JSON]: { schema: updatepurchaseSchema } } } },
	responses: { 200: { description: "Updated" }, 404: { description: "Purchase not found" } },
}, updatePurchase);

createRoute(router, {
	method: HttpMethod.DELETE,
	path: Endpoints.PURCHASES.DELETE,
	basePath: Endpoints.PURCHASES.BASE,
	tags: ["Purchases"],
	summary: "Delete a purchase",
	request: { params: purchaseIdSchema.shape.params },
	responses: { 200: { description: "Deleted" }, 404: { description: "Purchase not found" } },
}, deletePurchase);

createRoute(router, {
	method: HttpMethod.POST,
	path: Endpoints.PURCHASES.RESTORE,
	basePath: Endpoints.PURCHASES.BASE,
	tags: ["Purchases"],
	summary: "Restore a deleted purchase",
	request: { params: purchaseIdSchema.shape.params },
	responses: { 200: { description: "Restored" }, 400: { description: "Purchase is not deleted" }, 404: { description: "Purchase not found" } },
}, restorePurchase);

export default router;
