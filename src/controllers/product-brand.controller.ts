import { Request, Response } from "express";
import * as ProductBrandService from "../services/product-brand.service";
import { NotFoundError } from "../errors";
import {
    CreateProductBrandDTO,
    UpdateProductBrandDTO,
    ProductBrandResponseDTO,
} from "../dtos/product-brand.dto";

async function createProductBrand(
        req: Request<{}, ProductBrandResponseDTO, CreateProductBrandDTO>,
        res: Response<ProductBrandResponseDTO>
    ) {
        const brand = await ProductBrandService.createBrand(req.body);
        res.status(201).json(brand);
    }

async function getAllProductBrands(
        req: Request<{}, ProductBrandResponseDTO[], {}, { active?: string }>,
        res: Response<ProductBrandResponseDTO[]>
    ) {
        const activeOnly = req.query.active === "true";
        const brands = await ProductBrandService.getAllBrands(activeOnly);
        res.status(200).json(brands);
    }

async function getProductBrandById(
        req: Request<{ id: string }, ProductBrandResponseDTO>,
        res: Response<ProductBrandResponseDTO>
    ) {
        const id = Number(req.params.id);
        const brand = await ProductBrandService.getBrandById(id);

        if (!brand) {
            throw new NotFoundError("Product brand not found");
        }

        res.status(200).json(brand);
    }

async function updateProductBrand(
        req: Request<{ id: string }, ProductBrandResponseDTO, UpdateProductBrandDTO>,
        res: Response<ProductBrandResponseDTO>
    ) {
        const id = Number(req.params.id);
        const brand = await ProductBrandService.updateBrand(id, req.body);

        if (!brand) {
            throw new NotFoundError("Product brand not found");
        }

        res.status(200).json(brand);
    }

async function deleteProductBrand(
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

async function restoreProductBrand(
        req: Request<{ id: string }, ProductBrandResponseDTO>,
        res: Response<ProductBrandResponseDTO>
    ) {
        const id = Number(req.params.id);
        const brand = await ProductBrandService.restoreBrand(id);

        if (!brand) {
            throw new NotFoundError("Product brand not found or not deleted");
        }

        res.status(200).json(brand);
    }

export { createProductBrand, getAllProductBrands, getProductBrandById, updateProductBrand, deleteProductBrand, restoreProductBrand };