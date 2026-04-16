import { AppDataSource } from "../infra/config/data-source";
import { ProductCategory, IProductCategory } from "../infra/entities/product-category.entity";

const productCategoryRepository = AppDataSource.getRepository(ProductCategory);

async function createCategory(data: IProductCategory): Promise<ProductCategory> {
    const category = productCategoryRepository.create(data);
    return await productCategoryRepository.save(category);
}

async function getAllCategories(activeOnly: boolean = false): Promise<ProductCategory[]> {
    return await productCategoryRepository.find({
        withDeleted: !activeOnly,
        relations: ["parent"],
    });
}

async function getCategoryById(id: number, withDeleted: boolean = false): Promise<ProductCategory | null> {
    return await productCategoryRepository.findOne({
        where: { id },
        withDeleted,
        relations: ["parent"],
    });
}

async function updateCategory(category: ProductCategory): Promise<ProductCategory> {
    return await productCategoryRepository.save(category);
}

async function deleteCategory(category: ProductCategory): Promise<boolean> {
    const result = await productCategoryRepository.softRemove(category);
    return !!result;
}

async function restoreCategory(category: ProductCategory): Promise<ProductCategory> {
    return await productCategoryRepository.recover(category);
}

export { createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory, restoreCategory };
