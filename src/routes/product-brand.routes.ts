import { Router } from "express";
import { ProductBrandController } from "../controllers/product-brand.controller";
import { Endpoints } from "../utils/constants/endpoints";

const router = Router();

router.post(Endpoints.PRODUCT_BRANDS.CREATE, ProductBrandController.create);
router.get(Endpoints.PRODUCT_BRANDS.GET_ALL, ProductBrandController.getAll);
router.get(Endpoints.PRODUCT_BRANDS.GET_BY_ID, ProductBrandController.getById);
router.put(Endpoints.PRODUCT_BRANDS.UPDATE, ProductBrandController.update);
router.delete(Endpoints.PRODUCT_BRANDS.DELETE, ProductBrandController.delete);
router.patch(Endpoints.PRODUCT_BRANDS.RESTORE, ProductBrandController.restore);

export default router;