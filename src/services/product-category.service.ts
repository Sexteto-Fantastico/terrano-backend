import { AppDataSource } from "../config/data-source";
import { ProductCategory, IProductCategory } from "../entities/product-category.entity";
import {
    ProductCategoryResponseDto,
    CreateProductCategoryDto,
    UpdateProductCategoryDto,
    toProductCategoryResponseDto,
    toProductCategoryResponseDtoList,
} from "../dtos/product-category.dto";

const productCategoryRepository = AppDataSource.getRepository(ProductCategory);

export class ProductCategoryService {
    static async createCategory(data: CreateProductCategoryDto): Promise<ProductCategoryResponseDto> {
        const category = productCategoryRepository.create(data as IProductCategory);
        const saved = await productCategoryRepository.save(category);

        const loaded = await productCategoryRepository.findOne({
            where: { id: saved.id },
            relations: ["parent"]
        });

        return toProductCategoryResponseDto(loaded!);
    }

    static async getAllCategories(activeOnly: boolean = false): Promise<ProductCategoryResponseDto[]> {
        const categories = await productCategoryRepository.find({
            withDeleted: !activeOnly,
            relations: ["parent"],
        });
        return toProductCategoryResponseDtoList(categories);
    }

    static async getCategoryById(id: number): Promise<ProductCategoryResponseDto | null> {
        const category = await productCategoryRepository.findOne({
            where: { id },
            withDeleted: true,
            relations: ["parent"],
        });
        if (!category) return null;
        return toProductCategoryResponseDto(category);
    }

    static async updateCategory(id: number, data: UpdateProductCategoryDto): Promise<ProductCategoryResponseDto | null> {
        const category = await productCategoryRepository.findOne({ where: { id }, withDeleted: true });
        if (!category) return null;

        Object.assign(category, data);
        await productCategoryRepository.save(category);

        const loaded = await productCategoryRepository.findOne({
            where: { id },
            withDeleted: true,
            relations: ["parent"]
        });

        return toProductCategoryResponseDto(loaded!);
    }

    static async deleteCategory(id: number): Promise<boolean> {
        const category = await productCategoryRepository.findOne({ where: { id } });
        if (!category) return false;

        await productCategoryRepository.softRemove(category);
        return true;
    }

    static async restoreCategory(id: number): Promise<ProductCategoryResponseDto | null> {
        const category = await productCategoryRepository.findOne({
            where: { id },
            withDeleted: true,
            relations: ["parent"],
        });

        if (!category) return null;
        if (!category.deleted_at) return null;

        await productCategoryRepository.recover(category);
        return toProductCategoryResponseDto(category);
    }
}
