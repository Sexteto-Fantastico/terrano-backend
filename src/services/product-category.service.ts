import { ProductCategory, IProductCategory } from "../infra/entities/product-category.entity";
import {
    ProductCategoryResponseDTO,
    CreateProductCategoryDTO,
    UpdateProductCategoryDTO,
    toProductCategoryResponseDTO,
    toProductCategoryResponseDTOList,
} from "../dtos/product-category.dto";
import { createCategory as repoCreateCategory, getAllCategories as repoGetAllCategories, getCategoryById as repoGetCategoryById, updateCategory as repoUpdateCategory, deleteCategory as repoDeleteCategory, restoreCategory as repoRestoreCategory } from "../repositories/product-category.repository";

async function createCategory(data: CreateProductCategoryDTO): Promise<ProductCategoryResponseDTO> {
    const category = await repoCreateCategory(data as IProductCategory);
    const loaded = await repoGetCategoryById(category.id);
    return toProductCategoryResponseDTO(loaded!);
}

async function getAllCategories(activeOnly: boolean = false): Promise<ProductCategoryResponseDTO[]> {
    const categories = await repoGetAllCategories(activeOnly);
    return toProductCategoryResponseDTOList(categories);
}

async function getCategoryById(id: number): Promise<ProductCategoryResponseDTO | null> {
    const category = await repoGetCategoryById(id, true);
    if (!category) return null;
    return toProductCategoryResponseDTO(category);
}

async function updateCategory(id: number, data: UpdateProductCategoryDTO): Promise<ProductCategoryResponseDTO | null> {
    const category = await repoGetCategoryById(id, true);
    if (!category) return null;

    Object.assign(category, data);
    await repoUpdateCategory(category);

    const loaded = await repoGetCategoryById(id, true);
    return toProductCategoryResponseDTO(loaded!);
}

async function deleteCategory(id: number): Promise<boolean> {
    const category = await repoGetCategoryById(id, false);
    if (!category) return false;
    await repoDeleteCategory(category);
    return true;
}

async function restoreCategory(id: number): Promise<ProductCategoryResponseDTO | null> {
    const category = await repoGetCategoryById(id, true);

    if (!category) return null;
    if (!category.deleted_at) return null;

    await repoRestoreCategory(category);
    return toProductCategoryResponseDTO(category);
}

export { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory, restoreCategory };
