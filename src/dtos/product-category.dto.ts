import { ProductCategory } from "../infra/entities/product-category.entity";

export class ProductCategoryParentDTO {
    id!: number;
    name!: string;
    description?: string;
    deleted_at?: Date | null;
}

export class ProductCategoryResponseDTO {
    id!: number;
    name!: string;
    description?: string;
    deleted_at?: Date | null;
    parent?: ProductCategoryParentDTO | null;
}

export class CreateProductCategoryDTO {
    name!: string;
    description?: string;
    parent_id?: number;
}

export class UpdateProductCategoryDTO {
    name?: string;
    description?: string;
    parent_id?: number | null;
}

export function toProductCategoryResponseDTO(entity: ProductCategory): ProductCategoryResponseDTO {
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

export function toProductCategoryResponseDTOList(entities: ProductCategory[]): ProductCategoryResponseDTO[] {
    return entities.map(toProductCategoryResponseDTO);
}
