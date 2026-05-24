import { AppDataSource } from "../infra/config/data-source";
import { ProductBrand } from "../infra/entities/product-brand.entity";
import { FindOptionsWhere, ILike } from "typeorm";

const productBrandRepository = AppDataSource.getRepository(ProductBrand);

async function createBrand(data: ProductBrand): Promise<ProductBrand> {
    const brand = productBrandRepository.create(data);
    return await productBrandRepository.save(brand);
}

async function getAllBrands(filters: { name?: string; activeOnly?: boolean } = {}, limit: number = 20, offset: number = 0): Promise<[ProductBrand[], number]> {
    const { name, activeOnly = true } = filters;

    const where: FindOptionsWhere<ProductBrand> = {} as FindOptionsWhere<ProductBrand>;

    if (name) where.name = ILike(`%${name}%`);

    return await productBrandRepository.findAndCount({
        where,
        withDeleted: !activeOnly,
        order: { name: "ASC" },
        take: limit,
        skip: offset,
    });
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
