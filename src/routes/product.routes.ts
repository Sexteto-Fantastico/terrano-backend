import { Router } from "express";
import { asyncHandler } from "../utils/async-handler";
import { Endpoints } from "../utils/constants/endpoints";
import { paginationMiddleware } from "../middlewares/pagination.middleware";
import { getProductLogs } from "../controllers/system-log.controller";
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, restoreProduct } from "../controllers/product.controller";
import { validateRequest } from "../middlewares/validate.middleware";
import { productQuerySchema, createProductSchema, updateProductSchema, productIdSchema } from "../dtos/product.dto";

const router = Router();

router.post(Endpoints.PRODUCTS.CREATE, validateRequest(createProductSchema), asyncHandler(createProduct));

router.get(Endpoints.PRODUCTS.GET_ALL, validateRequest(productQuerySchema), paginationMiddleware, asyncHandler(getAllProducts));

router.get(Endpoints.PRODUCTS.GET_BY_ID, validateRequest(productIdSchema), asyncHandler(getProductById));

router.get(
    "/:id/logs",
    validateRequest(productIdSchema),
    asyncHandler(getProductLogs)
);

router.put(Endpoints.PRODUCTS.UPDATE, validateRequest(updateProductSchema), asyncHandler(updateProduct));

router.delete(Endpoints.PRODUCTS.DELETE, validateRequest(productIdSchema), asyncHandler(deleteProduct));

router.post(Endpoints.PRODUCTS.RESTORE, validateRequest(productIdSchema), asyncHandler(restoreProduct));

export default router;