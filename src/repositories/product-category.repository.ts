import { FindOptionsWhere, FindManyOptions, FindOptionsOrder, ILike } from "typeorm";
import { AppDataSource } from "../infra/config/data-source";
import { ProductCategory, IProductCategory } from "../infra/entities/product-category.entity";
import { ProductCategoryQueryDTO } from "../dtos/product-category.dto";

const productCategoryRepository = AppDataSource.getRepository(ProductCategory);

async function createCategory(data: IProductCategory): Promise<ProductCategory> {
    const category = productCategoryRepository.create(data);
    return await productCategoryRepository.save(category);
}

async function getAllCategories(filters: ProductCategoryQueryDTO = {}): Promise<[ProductCategory[], number]> {
    const { activeOnly = true, name, pageIndex, pageSize, sortBy, sortOrder } = filters;

    const where: FindOptionsWhere<ProductCategory> = {};

    if (name) where.name = ILike(`%${name}%`);

    const options: FindManyOptions<ProductCategory> = {
        where,
        withDeleted: !activeOnly,
        relations: ["parent"],
    };

    if (sortBy) {
        options.order = { [sortBy]: sortOrder ?? "ASC" };
    }

    if (pageIndex !== undefined && pageSize !== undefined) {
        options.take = pageSize;
        options.skip = (pageIndex - 1) * pageSize;
        return await productCategoryRepository.findAndCount(options);
    }

    const results = await productCategoryRepository.find(options);
    return [results, results.length];
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
