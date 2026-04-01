import { Request, Response } from "express";
import { ProductCategoryService } from "../services/product-category.service";
import { CreateProductCategoryDto } from "../dtos/product-category";
import { UpdateProductCategoryDto } from "../dtos/product-category";

export class ProductCategoryController {
    static async create(req: Request, res: Response) {
        try {
            const dto = new CreateProductCategoryDto(req.body);
            const category = await ProductCategoryService.createCategory(dto);
            res.status(201).json(category);
        } catch (error: any) {
            res.status(400).json({ error: error.message || "Failed to create category" });
        }
    }

    static async getAll(req: Request, res: Response) {
        try {
            const activeOnly = req.query.active === "true";
            const categories = await ProductCategoryService.getAllCategories(activeOnly);
            res.status(200).json(categories);
        } catch (error: any) {
            res.status(500).json({ error: error.message || "Failed to retrieve categories" });
        }
    }

    static async getById(req: Request, res: Response) {
        try {
            const category = await ProductCategoryService.getCategoryById(req.params.id as string);
            if (!category) {
                return res.status(404).json({ error: "Product category not found" });
            }
            res.status(200).json(category);
        } catch (error: any) {
            res.status(500).json({ error: error.message || "Failed to retrieve category by ID" });
        }
    }

    static async update(req: Request, res: Response) {
        try {
            const dto = new UpdateProductCategoryDto(req.body);
            const category = await ProductCategoryService.updateCategory(req.params.id as string, dto);
            if (!category) {
                return res.status(404).json({ error: "Product category not found" });
            }
            res.status(200).json(category);
        } catch (error: any) {
            res.status(400).json({ error: error.message || "Failed to update category" });
        }
    }

    static async delete(req: Request, res: Response) {
        try {
            const success = await ProductCategoryService.deleteCategory(req.params.id as string);
            if (!success) {
                return res.status(404).json({ error: "Product category not found" });
            }
            res.status(200).json({ message: "Product category deleted successfully" });
        } catch (error: any) {
            res.status(500).json({ error: error.message || "Failed to delete category" });
        }
    }

    static async restore(req: Request, res: Response) {
        try {
            const category = await ProductCategoryService.restoreCategory(req.params.id as string);
            if (!category) {
                return res.status(404).json({ error: "Product category not found or not deleted" });
            }
            res.status(200).json(category);
        } catch (error: any) {
            res.status(500).json({ error: error.message || "Failed to restore category" });
        }
    }
}
