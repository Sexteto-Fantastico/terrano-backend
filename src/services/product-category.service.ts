import { ProductCategory, IProductCategory } from "../entities/product-category.entity";

export class ProductCategoryService {
    static async createCategory(data: Partial<IProductCategory>): Promise<ProductCategory> {
        const category = new ProductCategory(data as IProductCategory);
        return await category.save();
    }

    static async getAllCategories(): Promise<ProductCategory[]> {
        return await ProductCategory.find({ withDeleted: true });
    }

    static async getCategoryById(id: string): Promise<ProductCategory | null> {
        return await ProductCategory.findOne({ where: { id }, withDeleted: true });
    }

    static async updateCategory(id: string, data: Partial<IProductCategory>): Promise<ProductCategory | null> {
        const category = await ProductCategory.findOne({ where: { id }, withDeleted: true });
        if (!category) return null;
        Object.assign(category, data);
        return await category.save();
    }

    static async deleteCategory(id: string, hardDelete: boolean = false): Promise<boolean> {
        const category = await ProductCategory.findOne({ where: { id }, withDeleted: hardDelete });
        if (!category) return false;

        if (hardDelete) {
            await category.remove();
        } else {
            await category.softRemove();
        }
        return true;
    }
}
