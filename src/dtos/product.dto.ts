import { ProductCategoryResponseDTO, toProductCategoryResponseDTO } from "./product-category.dto";
import { Product } from "../infra/entities/product.entity";

export class ProductResponseDTO {
    id: number;
    name: string;
    code: string;
    description?: string;
    category: ProductCategoryResponseDTO;
    minStock?: number;
}

export class CreateProductRequestDTO {
    name!: string;
    code!: string;
    description?: string;
    categoryId!: number;
    minStock?: number;
}

export class ProductUpdateRequestDTO {
    id!: number;
    name?: string;
    code?: string;
    description?: string;
    categoryId?: number;
    minStock?: number;
}

export function toProductResponseDTO(entity: Product): ProductResponseDTO {
    return {
        id: entity.id,
        name: entity.name,
        code: entity.code,
        description: entity.description,
        category: entity.category ? toProductCategoryResponseDTO(entity.category) : (undefined as any),
        minStock: entity.min_stock,
    };
}