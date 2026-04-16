export class CreateProductBrandDTO {
    name: string;
}

export class UpdateProductBrandDTO {
    name?: string;
}

export class ProductBrandResponseDTO {
    id: number;
    name: string;
    is_active?: boolean;
    created_at: Date;
    updated_at: Date;
}

export const toProductBrandResponseDTO = (brand: any): ProductBrandResponseDTO => ({
    id: brand.id,
    name: brand.name,
    is_active: brand.is_active,
    created_at: brand.created_at,
    updated_at: brand.updated_at,
});

export const toProductBrandResponseDTOList = (brands: any[]): ProductBrandResponseDTO[] =>
    brands.map(toProductBrandResponseDTO);