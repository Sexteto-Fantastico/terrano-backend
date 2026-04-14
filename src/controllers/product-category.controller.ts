import { Request, Response } from "express";
import * as ProductCategoryService from "../services/product-category.service";
import { NotFoundError } from "../errors";
import {
    CreateProductCategoryDTO,
    UpdateProductCategoryDTO,
    ProductCategoryResponseDTO,
} from "../dtos/product-category.dto";

async function createProductCategory(req: Request<{}, ProductCategoryResponseDTO, CreateProductCategoryDTO>, res: Response<ProductCategoryResponseDTO>) {
    const category = await ProductCategoryService.createCategory(req.body);
    res.status(201).json(category);
}

async function getAllProductCategories(req: Request<{}, ProductCategoryResponseDTO[], {}, { active?: string }>, res: Response<ProductCategoryResponseDTO[]>) {
    const activeOnly = req.query.active === "true";
    const categories = await ProductCategoryService.getAllCategories(activeOnly);
    res.status(200).json(categories);
}

async function getProductCategoryById(req: Request<{ id: string }, ProductCategoryResponseDTO>, res: Response<ProductCategoryResponseDTO>) {
    const id = Number(req.params.id);
    const category = await ProductCategoryService.getCategoryById(id);
    if (!category) {
        throw new NotFoundError("Product category not found");
    }
    res.status(200).json(category);
}

async function updateProductCategory(req: Request<{ id: string }, ProductCategoryResponseDTO, UpdateProductCategoryDTO>, res: Response<ProductCategoryResponseDTO>) {
    const id = Number(req.params.id);
    const category = await ProductCategoryService.updateCategory(id, req.body);
    if (!category) {
        throw new NotFoundError("Product category not found");
    }
    res.status(200).json(category);
}

async function deleteProductCategory(req: Request<{ id: string }>, res: Response<void>) {
    const id = Number(req.params.id);
    const success = await ProductCategoryService.deleteCategory(id);
    if (!success) {
        throw new NotFoundError("Product category not found");
    }
    res.status(200).json({ message: "Product category deleted successfully" } as any);
}

async function restoreProductCategory(req: Request<{ id: string }, ProductCategoryResponseDTO>, res: Response<ProductCategoryResponseDTO>) {
    const id = Number(req.params.id);
    const category = await ProductCategoryService.restoreCategory(id);
    if (!category) {
        throw new NotFoundError("Product category not found or not deleted");
    }
    res.status(200).json(category);
}

export { createProductCategory, getAllProductCategories, getProductCategoryById, updateProductCategory, deleteProductCategory, restoreProductCategory };