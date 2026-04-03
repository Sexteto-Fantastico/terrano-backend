import { Request, Response } from "express";
import { ProductCategoryService } from "../services/product-category.service";
import { NotFoundError } from "../errors";
import {
    CreateProductCategoryDto,
    UpdateProductCategoryDto,
    ProductCategoryResponseDto,
} from "../dtos/product-category.dto";

export class ProductCategoryController {
    static async create(req: Request<{}, ProductCategoryResponseDto, CreateProductCategoryDto>, res: Response<ProductCategoryResponseDto>) {
        const category = await ProductCategoryService.createCategory(req.body);
        res.status(201).json(category);
    }

    static async getAll(req: Request<{}, ProductCategoryResponseDto[], {}, { active?: string }>, res: Response<ProductCategoryResponseDto[]>) {
        const activeOnly = req.query.active === "true";
        const categories = await ProductCategoryService.getAllCategories(activeOnly);
        res.status(200).json(categories);
    }

    static async getById(req: Request<{ id: string }, ProductCategoryResponseDto>, res: Response<ProductCategoryResponseDto>) {
        const id = Number(req.params.id);
        const category = await ProductCategoryService.getCategoryById(id);
        if (!category) {
            throw new NotFoundError("Product category not found");
        }
        res.status(200).json(category);
    }

    static async update(req: Request<{ id: string }, ProductCategoryResponseDto, UpdateProductCategoryDto>, res: Response<ProductCategoryResponseDto>) {
        const id = Number(req.params.id);
        const category = await ProductCategoryService.updateCategory(id, req.body);
        if (!category) {
            throw new NotFoundError("Product category not found");
        }
        res.status(200).json(category);
    }

    static async delete(req: Request<{ id: string }>, res: Response<void>) {
        const id = Number(req.params.id);
        const success = await ProductCategoryService.deleteCategory(id);
        if (!success) {
            throw new NotFoundError("Product category not found");
        }
        res.status(200).json({ message: "Product category deleted successfully" } as any);
    }

    static async restore(req: Request<{ id: string }, ProductCategoryResponseDto>, res: Response<ProductCategoryResponseDto>) {
        const id = Number(req.params.id);
        const category = await ProductCategoryService.restoreCategory(id);
        if (!category) {
            throw new NotFoundError("Product category not found or not deleted");
        }
        res.status(200).json(category);
    }
}
