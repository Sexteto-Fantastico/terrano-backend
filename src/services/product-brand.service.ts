import { AppDataSource } from "../infra/config/data-source";
import { ProductBrand } from "../infra/entities/product-brand.entity";
import {
    CreateProductBrandDto,
    UpdateProductBrandDto,
    ProductBrandResponseDto,
    toProductBrandResponseDto,
    toProductBrandResponseDtoList,
} from "../dtos/product-brand.dto";

const repository = AppDataSource.getRepository(ProductBrand);

export class ProductBrandService {

    static async createBrand(data: CreateProductBrandDto): Promise<ProductBrandResponseDto> {
        const brand = repository.create(data);
        const saved = await repository.save(brand);
        return toProductBrandResponseDto(saved);
    }

    static async getAllBrands(activeOnly: boolean = false): Promise<ProductBrandResponseDto[]> {
        const brands = await repository.find({
            withDeleted: !activeOnly,
        });

        return toProductBrandResponseDtoList(brands);
    }

    static async getBrandById(id: number): Promise<ProductBrandResponseDto | null> {
        const brand = await repository.findOne({
            where: { id },
            withDeleted: true,
        });

        if (!brand) return null;

        return toProductBrandResponseDto(brand);
    }

    static async updateBrand(
        id: number,
        data: UpdateProductBrandDto
    ): Promise<ProductBrandResponseDto | null> {

        const brand = await repository.findOne({
            where: { id },
            withDeleted: true,
        });

        if (!brand) return null;

        Object.assign(brand, data);
        await repository.save(brand);

        return toProductBrandResponseDto(brand);
    }

    static async deleteBrand(id: number): Promise<boolean> {
        const brand = await repository.findOne({ where: { id } });
        if (!brand) return false;

        await repository.softRemove(brand);
        return true;
    }

    static async restoreBrand(id: number): Promise<ProductBrandResponseDto | null> {
        const brand = await repository.findOne({
            where: { id },
            withDeleted: true,
        });

        if (!brand || !brand.deleted_at) return null;

        await repository.recover(brand);

        return toProductBrandResponseDto(brand);
    }
}