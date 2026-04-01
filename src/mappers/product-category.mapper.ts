import { ProductCategory } from "../entities/product-category.entity";
import { ProductCategoryResponseDto, ProductCategoryParentDto } from "../dtos/product-category";

export class ProductCategoryMapper {
    static toResponseDto(entity: ProductCategory): ProductCategoryResponseDto {
        return new ProductCategoryResponseDto({
            id: entity.id,
            name: entity.name,
            description: entity.description,
            deleted_at: entity.deleted_at ?? null,
            parent: entity.parent ? new ProductCategoryParentDto({
                id: entity.parent.id,
                name: entity.parent.name,
                description: entity.parent.description,
                deleted_at: entity.parent.deleted_at ?? null,
            }) : null
        });
    }

    static toResponseDtoList(entities: ProductCategory[]): ProductCategoryResponseDto[] {
        return entities.map((entity) => this.toResponseDto(entity));
    }
}
