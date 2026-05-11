import { ProductCategory } from "../infra/entities/product-category.entity";

export class ProductCategoryQueryDTO {
    name?: string;
    activeOnly?: boolean;
}

export class ProductCategoryParentDTO {
    id!: number;
    name!: string;
    description?: string;
    deletedAt?: Date | null;
}

export class ProductCategoryResponseDTO {
    id!: number;
    name!: string;
    description?: string;
    deletedAt?: Date | null;
    parent?: ProductCategoryParentDTO | null;
}

export class CreateProductCategoryDTO {
    name!: string;
    description?: string;
    parentId?: number;
}

export class UpdateProductCategoryDTO {
    name?: string;
    description?: string;
    parentId?: number | null;
}

export function toProductCategoryResponseDTO(entity: ProductCategory): ProductCategoryResponseDTO {
    return {
        id: entity.id,
        name: entity.name,
        description: entity.description,
        deletedAt: entity.deleted_at ?? null,
        parent: entity.parent ? {
            id: entity.parent.id,
            name: entity.parent.name,
            description: entity.parent.description,
            deletedAt: entity.parent.deleted_at ?? null,
        } : null,
    };
}

export function toProductCategoryResponseDTOList(entities: ProductCategory[]): ProductCategoryResponseDTO[] {
    return entities.map(toProductCategoryResponseDTO);
}
