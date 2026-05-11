import { Request, Response } from "express";
import * as ProductCategoyService from "../services/product-category.service";
import { NotFoundError } from "../errors";
import {
    CreateProductCategoryDTO,
    UpdateProductCategoryDTO,
    ProductCategoryResponseDTO,
    ProductCategoryQueryDTO,
} from "../dtos/product-category.dto";
import { parseBooleanQuery } from "../utils/query.util";

async function createProductCategory(req: Request<ProductCategoryResponseDTO, CreateProductCategoryDTO>, res: Response<ProductCategoryResponseDTO>) {
    const category = await ProductCategoyService.createCategory(req.body);
    res.status(201).json(category);
}

async function getAllProductCategories(req: Request<{}, ProductCategoryResponseDTO[], {}, ProductCategoryQueryDTO>, res: Response<ProductCategoryResponseDTO[]>) {
    const query: ProductCategoryQueryDTO = {
        name: req.query.name,
        activeOnly: parseBooleanQuery(req.query.activeOnly)
    };
    const categories = await ProductCategoyService.getAllCategories(query);
    res.status(200).json(categories);
}

async function getProductCategoryById(req: Request<{ id: string }, ProductCategoryResponseDTO>, res: Response<ProductCategoryResponseDTO>) {
    const id = Number(req.params.id);
    const category = await ProductCategoyService.getCategoryById(id);
    if (!category) {
        throw new NotFoundError("Product category not found");
    }
    res.status(200).json(category);
}

async function updateProductCategory(req: Request<{ id: string }, ProductCategoryResponseDTO, UpdateProductCategoryDTO>, res: Response<ProductCategoryResponseDTO>) {
    const id = Number(req.params.id);
    const category = await ProductCategoyService.updateCategory(id, req.body);
    if (!category) {
        throw new NotFoundError("Product category not found");
    }
    res.status(200).json(category);
}

async function deleteProductCategory(req: Request<{ id: string }>, res: Response<void>) {
    const id = Number(req.params.id);
    const success = await ProductCategoyService.deleteCategory(id);
    if (!success) {
        throw new NotFoundError("Product category not found");
    }
    res.status(200).json({ message: "Product category deleted successfully" } as any);
}

async function restoreProductCategory(req: Request<{ id: string }, ProductCategoryResponseDTO>, res: Response<ProductCategoryResponseDTO>) {
    const id = Number(req.params.id);
    const category = await ProductCategoyService.restoreCategory(id);
    if (!category) {
        throw new NotFoundError("Product category not found or not deleted");
    }
    res.status(200).json(category);
}

export { createProductCategory, getAllProductCategories, getProductCategoryById, updateProductCategory, deleteProductCategory, restoreProductCategory };