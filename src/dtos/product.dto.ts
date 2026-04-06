import { ProductCategoryResponseDto } from "./product-category.dto";

export class ProductResponseDTO {
    id: number;
    name: string;
    code: string;
    description?: string;
    category: ProductCategoryResponseDto;
    min_stock?: number;
    created_at?: Date;
}

export class CreateProductRequestDTO {
    name: string;
    code: string;
    description?: string;
    categoryId: number;
    min_stock?: number;
}

export class ProductUpdateRequestDTO {
    id: number;
    name?: string;
    code?: string;
    description?: string;
    categoryId?: number;
    min_stock?: number;
};