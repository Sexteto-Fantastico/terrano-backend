import { ProductBrand } from "../infra/entities/product-brand.entity";
import {
    CreateProductBrandDTO,
    UpdateProductBrandDTO,
    ProductBrandResponseDTO,
    toProductBrandResponseDTO,
    toProductBrandResponseDTOList,
    ProductBrandQueryDTO,
} from "../dtos/product-brand.dto";
import * as ProductBrandRepository from "../repositories/product-brand.repository";

async function createBrand(data: CreateProductBrandDTO): Promise<ProductBrandResponseDTO> {
    const brand = await ProductBrandRepository.createBrand(data as ProductBrand);
    return toProductBrandResponseDTO(brand);
}

async function getAllBrands(filters: ProductBrandQueryDTO = {}, limit: number = 20, offset: number = 0): Promise<[ProductBrandResponseDTO[], number]> {
    const [brands, total] = await ProductBrandRepository.getAllBrands(filters, limit, offset);
    return [toProductBrandResponseDTOList(brands), total];
}

async function getBrandById(id: number): Promise<ProductBrandResponseDTO | null> {
    const brand = await ProductBrandRepository.getBrandById(id, true);

    if (!brand) return null;

    return toProductBrandResponseDTO(brand);
}

async function updateBrand(
    id: number,
    data: UpdateProductBrandDTO
): Promise<ProductBrandResponseDTO | null> {

    const brand = await ProductBrandRepository.getBrandById(id, true);

    if (!brand) return null;

    Object.assign(brand, data);
    await ProductBrandRepository.updateBrand(brand);

    return toProductBrandResponseDTO(brand);
}

async function deleteBrand(id: number): Promise<boolean> {
    const brand = await ProductBrandRepository.getBrandById(id, false);
    if (!brand) return false;

    await ProductBrandRepository.deleteBrand(brand);
    return true;
}

async function restoreBrand(id: number): Promise<ProductBrandResponseDTO | null> {
    const brand = await ProductBrandRepository.getBrandById(id, true);

    if (!brand || !brand.deleted_at) return null;

    await ProductBrandRepository.restoreBrand(brand);

    return toProductBrandResponseDTO(brand);
}

export {
    createBrand,
    getAllBrands,
    getBrandById,
    updateBrand,
    deleteBrand,
    restoreBrand,
};