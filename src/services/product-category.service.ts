import { ProductCategory, IProductCategory } from "../entities/product-category.entity";
import { ProductCategoryResponseDto } from "../dtos/product-category";
import { CreateProductCategoryDto } from "../dtos/product-category";
import { UpdateProductCategoryDto } from "../dtos/product-category";
import { ProductCategoryMapper } from "../mappers/product-category.mapper";

export class ProductCategoryService {
    static async createCategory(data: CreateProductCategoryDto): Promise<ProductCategoryResponseDto> {
        const category = new ProductCategory(data as IProductCategory);
        const saved = await category.save();
        return ProductCategoryMapper.toResponseDto(saved);
    }

    static async getAllCategories(activeOnly: boolean = false): Promise<ProductCategoryResponseDto[]> {
        const categories = await ProductCategory.find({
            withDeleted: !activeOnly,
            relations: ["parent"],
        });
        return ProductCategoryMapper.toResponseDtoList(categories);
    }

    static async getCategoryById(id: string): Promise<ProductCategoryResponseDto | null> {
        const category = await ProductCategory.findOne({
            where: { id },
            withDeleted: true,
            relations: ["parent"],
        });
        if (!category) return null;
        return ProductCategoryMapper.toResponseDto(category);
    }

    static async updateCategory(id: string, data: UpdateProductCategoryDto): Promise<ProductCategoryResponseDto | null> {
        const category = await ProductCategory.findOne({ where: { id }, withDeleted: true });
        if (!category) return null;
        Object.assign(category, data);
        await category.save();
        return ProductCategoryMapper.toResponseDto(category);
    }

    static async deleteCategory(id: string): Promise<boolean> {
        const category = await ProductCategory.findOne({ where: { id } });
        if (!category) return false;

        await category.softRemove();
        return true;
    }

    static async restoreCategory(id: string): Promise<ProductCategoryResponseDto | null> {
        const category = await ProductCategory.findOne({
            where: { id },
            withDeleted: true,
        });
        if (!category) return null;
        if (!category.deleted_at) return null;

        await category.recover();
        return ProductCategoryMapper.toResponseDto(category);
    }
}
