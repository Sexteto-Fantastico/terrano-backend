import { FindOptionsWhere, FindManyOptions, FindOptionsOrder, ILike } from "typeorm";
import { AppDataSource } from "../infra/config/data-source";
import { ProductBrand } from "../infra/entities/product-brand.entity";
import { ProductBrandQuery } from "../dtos/product-brand.dto";

const productBrandRepository = AppDataSource.getRepository(ProductBrand);

async function createBrand(data: ProductBrand): Promise<ProductBrand> {
    const brand = productBrandRepository.create(data);
    return await productBrandRepository.save(brand);
}

async function getAllBrands(filters: ProductBrandQuery = {}): Promise<[ProductBrand[], number]> {
    const { name, activeOnly = true, pageIndex, pageSize, sortBy, sortOrder } = filters;

    const where: FindOptionsWhere<ProductBrand> = {};

    if (name) where.name = ILike(`%${name}%`);

    const options: FindManyOptions<ProductBrand> = {
        where,
        withDeleted: !activeOnly,
    };

    if (sortBy) {
        options.order = { [sortBy]: sortOrder ?? "ASC" };
    }

    if (pageIndex !== undefined && pageSize !== undefined) {
        options.take = pageSize;
        options.skip = (pageIndex - 1) * pageSize;
        return await productBrandRepository.findAndCount(options);
    }

    const results = await productBrandRepository.find(options);
    return [results, results.length];
}

async function getBrandById(id: number, withDeleted: boolean = false): Promise<ProductBrand | null> {
    return await productBrandRepository.findOne({
        where: { id },
        withDeleted,
    });
}

async function updateBrand(brand: ProductBrand): Promise<ProductBrand> {
    return await productBrandRepository.save(brand);
}

async function deleteBrand(brand: ProductBrand): Promise<boolean> {
    const result = await productBrandRepository.softRemove(brand);
    return !!result;
}

async function restoreBrand(brand: ProductBrand): Promise<ProductBrand> {
    return await productBrandRepository.recover(brand);
}

export { createBrand, getAllBrands, getBrandById, updateBrand, deleteBrand, restoreBrand };
