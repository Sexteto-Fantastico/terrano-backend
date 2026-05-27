import { ProductCategory, IProductCategory } from "../infra/entities/product-category.entity";
import {
    ProductCategoryResponseDTO,
    CreateProductCategoryDTO,
    UpdateProductCategoryDTO,
    ProductCategoryQueryDTO,
    toProductCategoryResponseDTO,
    toProductCategoryResponseDTOList,
} from "../dtos/product-category.dto";
import * as ProductCategoryRepository from "../repositories/product-category.repository";

async function createCategory(data: CreateProductCategoryDTO): Promise<ProductCategoryResponseDTO> {
    const entityData: IProductCategory = {
        name: data.name,
        description: data.description,
        parent_id: data.parentId,
    };
    const category = await ProductCategoryRepository.createCategory(entityData);
    const loaded = await ProductCategoryRepository.getCategoryById(category.id);
    return toProductCategoryResponseDTO(loaded!);
}

async function getAllCategories(filters: ProductCategoryQueryDTO = {}): Promise<[ProductCategoryResponseDTO[], number]> {
    const [categories, total] = await ProductCategoryRepository.getAllCategories(filters);
    return [toProductCategoryResponseDTOList(categories), total];
}

async function getCategoryById(id: number): Promise<ProductCategoryResponseDTO | null> {
    const category = await ProductCategoryRepository.getCategoryById(id, true);
    if (!category) return null;
    return toProductCategoryResponseDTO(category);
}

async function updateCategory(id: number, data: UpdateProductCategoryDTO): Promise<ProductCategoryResponseDTO | null> {
    const category = await ProductCategoryRepository.getCategoryById(id, true);
    if (!category) return null;

    if (data.name !== undefined) category.name = data.name;
    if (data.description !== undefined) category.description = data.description;
    
    if (data.parentId !== undefined) {
        if (data.parentId === null) {
            category.parent_id = null as any;
            category.parent = null as any;
        } else {
            category.parent_id = data.parentId;
            category.parent = { id: data.parentId } as any; 
        }
    }

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
