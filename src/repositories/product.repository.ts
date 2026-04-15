import { AppDataSource } from "../infra/config/data-source";
import { IProduct, Product } from "../infra/entities/product.entity";

const productRepository = AppDataSource.getRepository(Product);

export interface IProductRepository {
    findAllProducts(): Promise<Product[]>;
    findProductById(id: number): Promise<Product | null>;
    saveProduct(data: Partial<Product>): Promise<Product>;
    deleteProduct(id: number): Promise<boolean>;
}

export class ProductRepository implements IProductRepository {
    findProductById(id: number): Promise<Product | null> {
        return productRepository.findOne({ where: { id: id }, relations: ["category"] });
    }

    async saveProduct(product: IProduct): Promise<Product> {
        return await productRepository.save(product);
    }

    async deleteProduct(id: number): Promise<boolean> {
        const result = await productRepository.delete(id);
        return result.affected !== 0;
    }

    async findAllProducts(): Promise<Product[]> {
        return await productRepository.find({ relations: ["category"] });
    }
}
