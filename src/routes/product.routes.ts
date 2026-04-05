import { Router } from "express";
import { asyncHandler } from "../utils/async-handler";
import { Endpoints } from "../utils/constants/endpoints";
import { ProductController } from "../controllers/product.controller";
import ProductService from "../services/product.service";
import { ProductRepository } from "../repositories/product.repository";

export function setupProductRoutes() {
    const router = Router();

    const productRepository = new ProductRepository();
    const productService = new ProductService(productRepository);
    const productController = new ProductController(productService);

    router.get(Endpoints.PRODUCTS.GET_ALL, asyncHandler(productController.getAllProducts.bind(productController)));
    router.get(Endpoints.PRODUCTS.GET_BY_ID, asyncHandler(productController.getProductById.bind(productController)));
    router.post(Endpoints.PRODUCTS.CREATE, asyncHandler(productController.createProduct.bind(productController)));
    router.put(Endpoints.PRODUCTS.UPDATE, asyncHandler(productController.updateProduct.bind(productController)));
    router.delete(Endpoints.PRODUCTS.DELETE, asyncHandler(productController.deleteProduct.bind(productController)));

    return router;
}