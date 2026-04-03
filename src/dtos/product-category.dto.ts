import { ProductCategory } from "../entities/product-category.entity";

export class ProductCategoryParentDto {
    id!: number;
    name!: string;
    description?: string;
    deleted_at?: Date | null;
}

export class ProductCategoryResponseDto {
    id!: number;
    name!: string;
    description?: string;
    deleted_at?: Date | null;
    parent?: ProductCategoryParentDto | null;
}

export class CreateProductCategoryDto {
    name!: string;
    description?: string;
    parent_id?: number;
}

export class UpdateProductCategoryDto {
    name?: string;
    description?: string;
    parent_id?: number | null;
}

export function toProductCategoryResponseDto(entity: ProductCategory): ProductCategoryResponseDto {
    return {
        id: entity.id,
        name: entity.name,
        description: entity.description,
        deleted_at: entity.deleted_at ?? null,
        parent: entity.parent ? {
            id: entity.parent.id,
            name: entity.parent.name,
            description: entity.parent.description,
            deleted_at: entity.parent.deleted_at ?? null,
        } : null,
    };
}

export function toProductCategoryResponseDtoList(entities: ProductCategory[]): ProductCategoryResponseDto[] {
    return entities.map(toProductCategoryResponseDto);
}
