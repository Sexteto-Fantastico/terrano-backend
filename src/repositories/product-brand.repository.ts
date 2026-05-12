import { AppDataSource } from "../infra/config/data-source";
import { ProductBrand } from "../infra/entities/product-brand.entity";

const productBrandRepository = AppDataSource.getRepository(ProductBrand);

async function createBrand(data: ProductBrand): Promise<ProductBrand> {
    const brand = productBrandRepository.create(data);
    return await productBrandRepository.save(brand);
}

async function getAllBrands(activeOnly: boolean = false, limit: number = 20, offset: number = 0): Promise<[ProductBrand[], number]> {
    return await productBrandRepository.findAndCount({
        withDeleted: !activeOnly,
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
