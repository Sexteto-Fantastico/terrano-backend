import { Request, Response } from "express";
import { ProductCategoryService } from "../services/product-category.service";

export class ProductCategoryController {
    static async create(req: Request, res: Response) {
        try {
            const category = await ProductCategoryService.createCategory(req.body);
            res.status(201).json(category);
        } catch (error: any) {
            res.status(400).json({ error: error.message || "Failed to create category" });
        }
    }

    static async getAll(req: Request, res: Response) {
        try {
            const categories = await ProductCategoryService.getAllCategories();
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
            const category = await ProductCategoryService.updateCategory(req.params.id as string, req.body);
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
            const isHardDelete = req.query.hard === "true";
            const success = await ProductCategoryService.deleteCategory(req.params.id as string, isHardDelete);
            if (!success) {
                return res.status(404).json({ error: "Product category not found" });
            }
            res.status(200).json({ message: "Product category deleted successfully" });
        } catch (error: any) {
            res.status(500).json({ error: error.message || "Failed to delete category" });
        }
    }
}
