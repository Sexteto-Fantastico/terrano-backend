import { ProductCategory, IProductCategory } from "../infra/entities/product-category.entity";
import {
    ProductCategoryResponseDTO,
    CreateProductCategoryDTO,
    UpdateProductCategoryDTO,
    toProductCategoryResponseDTO,
    toProductCategoryResponseDTOList,
} from "../dtos/product-category.dto";
import * as ProductCategoryRepository from "../repositories/product-category.repository";

async function createCategory(data: CreateProductCategoryDTO): Promise<ProductCategoryResponseDTO> {
    const category = await ProductCategoryRepository.createCategory(data as IProductCategory);
    const loaded = await ProductCategoryRepository.getCategoryById(category.id);
    return toProductCategoryResponseDTO(loaded!);
}

async function getAllCategories(activeOnly: boolean = false): Promise<ProductCategoryResponseDTO[]> {
    const categories = await ProductCategoryRepository.getAllCategories(activeOnly);
    return toProductCategoryResponseDTOList(categories);
}

async function getCategoryById(id: number): Promise<ProductCategoryResponseDTO | null> {
    const category = await ProductCategoryRepository.getCategoryById(id, true);
    if (!category) return null;
    return toProductCategoryResponseDTO(category);
}

async function updateCategory(id: number, data: UpdateProductCategoryDTO): Promise<ProductCategoryResponseDTO | null> {
    const category = await ProductCategoryRepository.getCategoryById(id, true);
    if (!category) return null;

    Object.assign(category, data);
    await ProductCategoryRepository.updateCategory(category);

    const loaded = await ProductCategoryRepository.getCategoryById(id, true);
    return toProductCategoryResponseDTO(loaded!);
}

async function deleteCategory(id: number): Promise<boolean> {
    const category = await ProductCategoryRepository.getCategoryById(id, false);
    if (!category) return false;
    await ProductCategoryRepository.deleteCategory(category);
    return true;
}

async function restoreCategory(id: number): Promise<ProductCategoryResponseDTO | null> {
    const category = await ProductCategoryRepository.getCategoryById(id, true);

    if (!category) return null;
    if (!category.deleted_at) return null;

    await ProductCategoryRepository.restoreCategory(category);
    return toProductCategoryResponseDTO(category);
}

export { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory, restoreCategory };
