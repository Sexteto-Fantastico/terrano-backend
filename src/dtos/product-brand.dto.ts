export class CreateProductBrandDTO {
    name: string;
}

export class UpdateProductBrandDTO {
    name?: string;
}

export class ProductBrandResponseDTO {
    id: number;
    name: string;
    isActive?: boolean;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}

export const toProductBrandResponseDTO = (brand: any): ProductBrandResponseDTO => ({
    id: brand.id,
    name: brand.name,
    isActive: brand.is_active,
    createdAt: brand.created_at,
    updatedAt: brand.updated_at,
    deletedAt: brand.deleted_at,
});

export const toProductBrandResponseDTOList = (brands: any[]): ProductBrandResponseDTO[] =>
    brands.map(toProductBrandResponseDTO);