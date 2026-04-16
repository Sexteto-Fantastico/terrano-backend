import { ProductBrand } from "../infra/entities/product-brand.entity";
import {
    CreateProductBrandDTO,
    UpdateProductBrandDTO,
    ProductBrandResponseDTO,
    toProductBrandResponseDTO,
    toProductBrandResponseDTOList,
} from "../dtos/product-brand.dto";
import * as ProductBrandRepository from "../repositories/product-brand.repository";

async function createBrand(data: CreateProductBrandDTO): Promise<ProductBrandResponseDTO> {
    const brand = await ProductBrandRepository.createBrand(data as ProductBrand);
    return toProductBrandResponseDTO(brand);
}

async function getAllBrands(activeOnly: boolean = false): Promise<ProductBrandResponseDTO[]> {
    const brands = await ProductBrandRepository.getAllBrands(activeOnly);
    return toProductBrandResponseDTOList(brands);
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