import { CreateProductRequestDTO, ProductResponseDTO, ProductUpdateRequestDTO } from "../dtos/product.dto";
import { BadRequestError, NotFoundError, ConflictError } from "../errors";
import * as ProductRepository from "../repositories/product.repository";
import { getCategoryById } from "../repositories/product-category.repository";

async function getAllProducts(): Promise<ProductResponseDTO[]> {
    const allProducts = await ProductRepository.getAllProducts();
    return allProducts;
}

async function getProductById(id: number): Promise<ProductResponseDTO> {
    const product = await ProductRepository.getProductById(id);
    if (!product) {
        throw new NotFoundError("Product not found");
    }
    return product;
}

async function createProduct(data: CreateProductRequestDTO): Promise<ProductResponseDTO> {
    try {
        if (!data.name || data.name.trim() === "") {
            throw new BadRequestError("Product name is required");
        }

        if (!data.code || data.code.trim() === "") {
            throw new BadRequestError("Product code is required");
        }

        const existingProduct = await ProductRepository.getProductByCode(data.code);
        if (existingProduct) {
            throw new ConflictError("Product code already exists");
        }

        if (!data.categoryId) {
            throw new BadRequestError("Category ID is required");
        }

        const category = await getCategoryById(data.categoryId);
        if (!category) {
            throw new NotFoundError("Category not found");
        }

        if (data.min_stock !== undefined && data.min_stock < 0) {
            throw new BadRequestError("Minimum stock cannot be negative");
        }

        const product = new (require("../infra/entities/product.entity").Product)({
            name: data.name.trim(),
            code: data.code.trim(),
            description: data.description?.trim(),
            category,
            min_stock: data.min_stock,
        });

        return await ProductRepository.saveProduct(product);

    } catch (error) {
        if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ConflictError) {
            throw error;
        }
        console.error("Error creating product:", error);
        throw error;
    }
}

async function updateProduct(data: ProductUpdateRequestDTO): Promise<ProductResponseDTO> {
    const existingProduct = await ProductRepository.getProductById(data.id);

    if (!existingProduct) {
        throw new NotFoundError("Product not found");
    }

    if (data.name !== undefined) {
        if (data.name.trim() === "") {
            throw new BadRequestError("Product name cannot be empty");
        }
        existingProduct.name = data.name.trim();
    }

    if (data.code !== undefined) {
        if (data.code.trim() === "") {
            throw new BadRequestError("Product code cannot be empty");
        }

        if (data.code !== existingProduct.code) {
            const productWithCode = await ProductRepository.getProductByCode(data.code);
            if (productWithCode) {
                throw new ConflictError("Product code already exists");
            }
        }
        existingProduct.code = data.code.trim();
    }

    if (data.description !== undefined) {
        existingProduct.description = data.description?.trim();
    }

    if (data.categoryId !== undefined) {
        const category = await getCategoryById(data.categoryId);
        if (!category) {
            throw new NotFoundError("Category not found");
        }
        existingProduct.category = category;
    }

    if (data.min_stock !== undefined) {
        if (data.min_stock < 0) {
            throw new BadRequestError("Minimum stock cannot be negative");
        }
        existingProduct.min_stock = data.min_stock;
    }

    return await ProductRepository.saveProduct(existingProduct);
}

async function deleteProduct(id: number): Promise<boolean> {
    const product = await ProductRepository.getProductById(id);
    if (!product) {
        throw new NotFoundError("Product not found");
    }

    return await ProductRepository.deleteProduct(id);
}

export { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };