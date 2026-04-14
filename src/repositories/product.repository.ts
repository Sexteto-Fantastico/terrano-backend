import { AppDataSource } from "../infra/config/data-source";
import { Product } from "../infra/entities/product.entity";

const productRepository = AppDataSource.getRepository(Product);

async function findProductById(id: number): Promise<Product | null> {
    return productRepository.findOne({ where: { id: id }, relations: ["category"] });
}

async function findProductByCode(code: string): Promise<Product | null> {
    return productRepository.findOne({ where: { code } });
}

async function saveProduct(product: Product): Promise<Product> {
    return await productRepository.save(product);
}

async function deleteProduct(id: number): Promise<boolean> {
    const result = await productRepository.delete(id);
    return result.affected !== 0;
}

async function findAllProducts(): Promise<Product[]> {
    return await productRepository.find({ relations: ["category"] });
}

export { findProductById, findProductByCode, saveProduct, deleteProduct, findAllProducts };