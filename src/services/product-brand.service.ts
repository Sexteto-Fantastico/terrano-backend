import { ProductBrand } from "../infra/entities/product-brand.entity";
import {
    CreateProductBrand,
    UpdateProductBrand,
    ProductBrandResponse,
    toProductBrandResponse,
    toProductBrandResponseList,
    ProductBrandQuery,
} from "../dtos/product-brand.dto";
import * as ProductBrandRepository from "../repositories/product-brand.repository";

async function createBrand(data: CreateProductBrand): Promise<ProductBrandResponse> {
    const brand = await ProductBrandRepository.createBrand(data as ProductBrand);
    return toProductBrandResponse(brand);
}

async function getAllBrands(filters: ProductBrandQuery = {}): Promise<[ProductBrandResponse[], number]> {
    const [brands, total] = await ProductBrandRepository.getAllBrands(filters);
    return [toProductBrandResponseList(brands), total];
}

async function getBrandById(id: number): Promise<ProductBrandResponse | null> {
    const brand = await ProductBrandRepository.getBrandById(id, true);

    if (!brand) return null;

    return toProductBrandResponse(brand);
}

async function updateBrand(
    id: number,
    data: UpdateProductBrand
): Promise<ProductBrandResponse | null> {

    const brand = await ProductBrandRepository.getBrandById(id, true);

    if (!brand) return null;

    Object.assign(brand, data);
    await ProductBrandRepository.updateBrand(brand);

    return toProductBrandResponse(brand);
}

async function deleteBrand(id: number): Promise<boolean> {
    const brand = await ProductBrandRepository.getBrandById(id, false);
    if (!brand) return false;

    await ProductBrandRepository.deleteBrand(brand);
    return true;
}

async function restoreBrand(id: number): Promise<ProductBrandResponse | null> {
    const brand = await ProductBrandRepository.getBrandById(id, true);

    if (!brand || !brand.deleted_at) return null;

    await ProductBrandRepository.restoreBrand(brand);

    return toProductBrandResponse(brand);
}

export {
    createBrand,
    getAllBrands,
    getBrandById,
    updateBrand,
    deleteBrand,
    restoreBrand,
};