import { Router } from "express";
import { createProductBrand, getAllProductBrands, getProductBrandById, updateProductBrand, deleteProductBrand, restoreProductBrand } from "../controllers/product-brand.controller";
import { Endpoints } from "../utils/constants/endpoints";
import { asyncHandler } from "../utils/async-handler";
import { paginationMiddleware } from "../middlewares/pagination.middleware";
import { validateRequest } from "../middlewares/validate.middleware";
import { createProductBrandSchema, updateProductBrandSchema, productBrandIdSchema, productBrandQuerySchema } from "../dtos/product-brand.dto";

const router = Router();

router.post(Endpoints.PRODUCT_BRANDS.CREATE, validateRequest(createProductBrandSchema), asyncHandler(createProductBrand));
router.get(Endpoints.PRODUCT_BRANDS.GET_ALL, validateRequest(productBrandQuerySchema), paginationMiddleware, asyncHandler(getAllProductBrands));
router.get(Endpoints.PRODUCT_BRANDS.GET_BY_ID, validateRequest(productBrandIdSchema), asyncHandler(getProductBrandById));
router.put(Endpoints.PRODUCT_BRANDS.UPDATE, validateRequest(updateProductBrandSchema), asyncHandler(updateProductBrand));
router.delete(Endpoints.PRODUCT_BRANDS.DELETE, validateRequest(productBrandIdSchema), asyncHandler(deleteProductBrand));
router.patch(Endpoints.PRODUCT_BRANDS.RESTORE, validateRequest(productBrandIdSchema), asyncHandler(restoreProductBrand));

export default router;