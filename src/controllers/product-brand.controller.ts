import { Request, Response } from "express";
import { ProductBrandService } from "../services/product-brand.service";
import { NotFoundError } from "../errors";
import {
    CreateProductBrandDto,
    UpdateProductBrandDto,
    ProductBrandResponseDto,
} from "../dtos/product-brand.dto";

export class ProductBrandController {

    static async create(
        req: Request<{}, ProductBrandResponseDto, CreateProductBrandDto>,
        res: Response<ProductBrandResponseDto>
    ) {
        const brand = await ProductBrandService.createBrand(req.body);
        res.status(201).json(brand);
    }

    static async getAll(
        req: Request<{}, ProductBrandResponseDto[], {}, { active?: string }>,
        res: Response<ProductBrandResponseDto[]>
    ) {
        const activeOnly = req.query.active === "true";
        const brands = await ProductBrandService.getAllBrands(activeOnly);
        res.status(200).json(brands);
    }

    static async getById(
        req: Request<{ id: string }, ProductBrandResponseDto>,
        res: Response<ProductBrandResponseDto>
    ) {
        const id = Number(req.params.id);
        const brand = await ProductBrandService.getBrandById(id);

        if (!brand) {
            throw new NotFoundError("Product brand not found");
        }

        res.status(200).json(brand);
    }

    static async update(
        req: Request<{ id: string }, ProductBrandResponseDto, UpdateProductBrandDto>,
        res: Response<ProductBrandResponseDto>
    ) {
        const id = Number(req.params.id);
        const brand = await ProductBrandService.updateBrand(id, req.body);

        if (!brand) {
            throw new NotFoundError("Product brand not found");
        }

        res.status(200).json(brand);
    }

    static async delete(
        req: Request<{ id: string }>,
        res: Response
    ) {
        const id = Number(req.params.id);
        const success = await ProductBrandService.deleteBrand(id);

        if (!success) {
            throw new NotFoundError("Product brand not found");
        }

        res.status(200).json({ message: "Product brand deleted successfully" });
    }

    static async restore(
        req: Request<{ id: string }, ProductBrandResponseDto>,
        res: Response<ProductBrandResponseDto>
    ) {
        const id = Number(req.params.id);
        const brand = await ProductBrandService.restoreBrand(id);

        if (!brand) {
            throw new NotFoundError("Product brand not found or not deleted");
        }

        res.status(200).json(brand);
    }
}