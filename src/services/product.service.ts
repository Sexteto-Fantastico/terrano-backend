import { CreateProductRequestDTO, ProductResponseDTO, ProductUpdateRequestDTO } from "../dtos/product.dto";
import { NotFoundError } from "../errors/app-error";
import { IProductRepository } from "../repositories/product.repository";


interface IProductService {
    getAllProducts(): Promise<ProductResponseDTO[]>;
    getProductById(id: number): Promise<ProductResponseDTO | null>;
    createProduct(data: CreateProductRequestDTO): Promise<ProductResponseDTO>;
    updateProduct(data: ProductUpdateRequestDTO): Promise<ProductResponseDTO | null>;
    deleteProduct(id: number): Promise<boolean>;
}

class ProductService implements IProductService {
    private readonly productRepository: IProductRepository;

    constructor(productRepository: IProductRepository) {
        this.productRepository = productRepository;
    }

    async getAllProducts(): Promise<ProductResponseDTO[]> {
        const allProducts = await this.productRepository.findAllProducts();
        return allProducts;
    }

    async getProductById(id: number): Promise<ProductResponseDTO> {
        const product = await this.productRepository.findProductById(id);
        if (!product) {
            throw new NotFoundError("Product not found");
        }
        return product;
    }

    async createProduct(data: CreateProductRequestDTO): Promise<ProductResponseDTO> {
        try {
            const { name, description } = data;

            if (!name || name.trim() === "") {
                throw new Error("Product name is required");
            }

            return await this.productRepository.saveProduct(data);

        } catch (error) {
            console.error("Error creating product:", error);
            throw error;
        }
    }

    async updateProduct(data: ProductUpdateRequestDTO): Promise<ProductResponseDTO> {
        const existingProduct = await this.productRepository.findProductById(data.id);

        if (!existingProduct) {
            throw new NotFoundError("Product not found");
        }

        const updatedProduct = Object.assign(existingProduct, data);
        return this.productRepository.saveProduct(updatedProduct);
    }

    async deleteProduct(id: number): Promise<boolean> {
        return this.productRepository.deleteProduct(id);
    }
}

export default ProductService;