import { Router } from "express";
import { createProductCategory, getAllProductCategories, getProductCategoryById, updateProductCategory, deleteProductCategory, restoreProductCategory } from "../controllers/product-category.controller";
import { Endpoints } from "../utils/constants/endpoints";
import { asyncHandler } from "../utils/async-handler";
import { paginationMiddleware } from "../middlewares/pagination.middleware";
import { validateRequest } from "../middlewares/validate.middleware";
import { createProductCategorySchema, updateProductCategorySchema, productCategoryIdSchema, productCategoryQuerySchema } from "../dtos/product-category.dto";

const router = Router();

router.post(Endpoints.PRODUCT_CATEGORIES.CREATE, validateRequest(createProductCategorySchema), asyncHandler(createProductCategory));
router.get(Endpoints.PRODUCT_CATEGORIES.GET_ALL, validateRequest(productCategoryQuerySchema), paginationMiddleware, asyncHandler(getAllProductCategories));
router.get(Endpoints.PRODUCT_CATEGORIES.GET_BY_ID, validateRequest(productCategoryIdSchema), asyncHandler(getProductCategoryById));
router.put(Endpoints.PRODUCT_CATEGORIES.UPDATE, validateRequest(updateProductCategorySchema), asyncHandler(updateProductCategory));
router.delete(Endpoints.PRODUCT_CATEGORIES.DELETE, validateRequest(productCategoryIdSchema), asyncHandler(deleteProductCategory));
router.patch(Endpoints.PRODUCT_CATEGORIES.RESTORE, validateRequest(productCategoryIdSchema), asyncHandler(restoreProductCategory));

export default router;
