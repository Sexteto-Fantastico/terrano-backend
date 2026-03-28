import { Router } from "express";
import { ProductCategoryController } from "../controllers/product-category.controller";
import { Endpoints } from "../utils/constants/endpoints";

const router = Router();

router.post(Endpoints.PRODUCT_CATEGORIES.CREATE, ProductCategoryController.create);
router.get(Endpoints.PRODUCT_CATEGORIES.GET_ALL, ProductCategoryController.getAll);
router.get(Endpoints.PRODUCT_CATEGORIES.GET_BY_ID, ProductCategoryController.getById);
router.put(Endpoints.PRODUCT_CATEGORIES.UPDATE, ProductCategoryController.update);
router.delete(Endpoints.PRODUCT_CATEGORIES.DELETE, ProductCategoryController.delete);

export default router;
