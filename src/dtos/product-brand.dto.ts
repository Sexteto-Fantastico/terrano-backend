export interface CreateProductBrandDto {
    name: string;
}

export interface UpdateProductBrandDto {
    name?: string;
}

export interface ProductBrandResponseDto {
    id: number;
    name: string;
    is_active?: boolean;
    created_at: Date;
    updated_at: Date;
}

export const toProductBrandResponseDto = (brand: any): ProductBrandResponseDto => ({
    id: brand.id,
    name: brand.name,
    is_active: brand.is_active,
    created_at: brand.created_at,
    updated_at: brand.updated_at,
});

export const toProductBrandResponseDtoList = (brands: any[]): ProductBrandResponseDto[] =>
    brands.map(toProductBrandResponseDto);