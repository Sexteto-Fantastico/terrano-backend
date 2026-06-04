import { Request, Response } from "express";
import * as ProductCategoyService from "../services/product-category.service";
import { NotFoundError } from "../errors";
import {
    CreateProductCategory,
    UpdateProductCategory,
    ProductCategoryResponse,
    ProductCategoryQuery,
} from "../dtos/product-category.dto";

async function createProductCategory(req: Request<ProductCategoryResponse, CreateProductCategory>, res: Response<ProductCategoryResponse>) {
    const category = await ProductCategoyService.createCategory(req.body);
    res.status(201).json(category);
}

async function getAllProductCategories(req: Request<{}, ProductCategoryResponse[], {}, ProductCategoryQuery>, res: Response<ProductCategoryResponse[]>) {
    const [categories, total] = await ProductCategoyService.getAllCategories(req.query);
    res.set("X-Total-Count", total.toString());
    res.status(200).json(categories);
}

async function getProductCategoryById(req: Request<{ id: string }, ProductCategoryResponse>, res: Response<ProductCategoryResponse>) {
    const id = Number(req.params.id);
    const category = await ProductCategoyService.getCategoryById(id);
    if (!category) {
        throw new NotFoundError("Product category not found");
    }
    res.status(200).json(category);
}

async function updateProductCategory(req: Request<{ id: string }, ProductCategoryResponse, UpdateProductCategory>, res: Response<ProductCategoryResponse>) {
    const id = Number(req.params.id);
    const category = await ProductCategoyService.updateCategory(id, req.body);
    if (!category) {
        throw new NotFoundError("Product category not found");
    }
    res.status(200).json(category);
}

async function deleteProductCategory(req: Request<{ id: string }>, res: Response) {
    const id = Number(req.params.id);
    const success = await ProductCategoyService.deleteCategory(id);
    if (!success) {
        throw new NotFoundError("Product category not found");
    }
    res.status(204).send();
}

async function restoreProductCategory(req: Request<{ id: string }, ProductCategoryResponse>, res: Response<ProductCategoryResponse>) {
    const id = Number(req.params.id);
    const category = await ProductCategoyService.restoreCategory(id);
    if (!category) {
        throw new NotFoundError("Product category not found or not deleted");
    }
    res.status(200).json(category);
}

export { createProductCategory, getAllProductCategories, getProductCategoryById, updateProductCategory, deleteProductCategory, restoreProductCategory };