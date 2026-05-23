import { AppDataSource } from "../infra/config/data-source";
import { Product } from "../infra/entities/product.entity";
import { FindOptionsWhere, ILike } from "typeorm";
import { ProductQueryDTO } from "../dtos/product.dto";

const productRepository = AppDataSource.getRepository(Product);

async function getProductById(id: number, withDeleted = false): Promise<Product | null> {
    return productRepository.findOne({ where: { id: id }, relations: ["category", "measurement_unit", "brand"], withDeleted });
}

async function getProductByCode(code: string): Promise<Product | null> {
    return productRepository.findOne({ where: { code } });
}

async function saveProduct(product: Product): Promise<Product> {
    return await productRepository.save(product);
}

async function deleteProduct(id: number): Promise<boolean> {
    const result = await productRepository.softDelete(id);
    return result.affected !== 0;
}

async function restoreProduct(id: number): Promise<boolean> {
    const result = await productRepository.restore(id);
    return result.affected !== 0;
}

async function getAllProducts(filters: ProductQueryDTO = {}): Promise<[Product[], number]> {
    const { name, activeOnly = true, brandId, categoryId, code, pageIndex, pageSize } = filters;
    const where: FindOptionsWhere<Product> = {};

    if (name) where.name = ILike(`%${name}%`);
    if (code) where.code = ILike(`%${code}%`);
    if (brandId) where.brand_id = brandId;
    if (categoryId) where.category_id = categoryId;

    const dbQuery: any = {
        where,
        relations: ["category", "measurement_unit", "brand"],
        withDeleted: !activeOnly,
        order: { name: "ASC" },
    };

    if (pageIndex !== undefined && pageSize !== undefined) {
        dbQuery.take = pageSize;
        dbQuery.skip = (pageIndex - 1) * pageSize;
        return await productRepository.findAndCount(dbQuery);
    }

    const results = await productRepository.find(dbQuery);
    return [results, results.length];
}

export { getProductById, getProductByCode, saveProduct, deleteProduct, restoreProduct, getAllProducts };