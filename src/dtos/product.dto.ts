import { ProductCategoryResponseDTO, toProductCategoryResponseDTO } from "./product-category.dto";
import { Product } from "../infra/entities/product.entity";
import { MeasurementUnitResponseDto, toMeasurementUnitResponseDto } from "./measurement-unit.dto";
import { ProductBrandResponseDTO, toProductBrandResponseDTO } from "./product-brand.dto";

export interface ProductQueryDTO {
    name?: string;
    activeOnly?: boolean;
    brandId?: number;
    categoryId?: number;
    code?: string;
}

export class ProductResponseDTO {
    id: number;
    name: string;
    code: string;
    description?: string;
    category: ProductCategoryResponseDTO;
    measurementUnit: MeasurementUnitResponseDto;
    brand: ProductBrandResponseDTO;
    minStock?: number;
    maxStock?: number;
    deletedAt: Date | null;
}

export class CreateProductRequestDTO {
    name!: string;
    code!: string;
    description?: string;
    categoryId!: number;
    measurementUnitId!: number;
    brandId!: number;
    minStock?: number;
    maxStock?: number;
}

export class ProductUpdateRequestDTO {
    id!: number;
    name?: string;
    code?: string;
    description?: string;
    categoryId?: number;
    measurementUnitId?: number;
    brandId?: number;
    minStock?: number;
    maxStock?: number;
}

export function toProductResponseDTO(entity: Product): ProductResponseDTO {
    return {
        id: entity.id,
        name: entity.name,
        code: entity.code,
        description: entity.description,
        category: toProductCategoryResponseDTO(entity.category),
        measurementUnit: toMeasurementUnitResponseDto(entity.measurement_unit),
        brand: toProductBrandResponseDTO(entity.brand),
        minStock: entity.min_stock,
        maxStock: entity.max_stock,
        deletedAt: entity.deleted_at ?? null,
    };
}
