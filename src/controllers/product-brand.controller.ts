import { Request, Response } from "express";
import * as ProductBrandService from "../services/product-brand.service";
import { NotFoundError } from "../errors";
import {
    CreateProductBrand,
    UpdateProductBrand,
    ProductBrandResponse,
    ProductBrandQuery,
} from "../dtos/product-brand.dto";

async function createProductBrand(
    req: Request<ProductBrandResponse, CreateProductBrand>,
    res: Response<ProductBrandResponse>
) {
    const brand = await ProductBrandService.createBrand(req.body);
    res.status(201).json(brand);
}

async function getAllProductBrands(
    req: Request<{}, ProductBrandResponse[], {}, ProductBrandQuery>,
    res: Response<ProductBrandResponse[]>
) {
    const [brands, total] = await ProductBrandService.getAllBrands(req.query);
    res.set("X-Total-Count", total.toString());
    res.status(200).json(brands);
}

async function getProductBrandById(
    req: Request<{ id: string }, ProductBrandResponse>,
    res: Response<ProductBrandResponse>
) {
    const id = Number(req.params.id);
    const brand = await ProductBrandService.getBrandById(id);

    if (!brand) {
        throw new NotFoundError("Product brand not found");
    }

    res.status(200).json(brand);
}

async function updateProductBrand(
    req: Request<{ id: string }, ProductBrandResponse, UpdateProductBrand>,
    res: Response<ProductBrandResponse>
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

    res.status(204).send();
}

async function restoreProductBrand(
    req: Request<{ id: string }, ProductBrandResponse>,
    res: Response<ProductBrandResponse>
) {
    const id = Number(req.params.id);
    const brand = await ProductBrandService.restoreBrand(id);

    if (!brand) {
        throw new NotFoundError("Product brand not found or not deleted");
    }

    res.status(200).json(brand);
}

export { createProductBrand, getAllProductBrands, getProductBrandById, updateProductBrand, deleteProductBrand, restoreProductBrand };