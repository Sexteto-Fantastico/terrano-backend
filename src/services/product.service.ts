import { CreateProductRequestDTO, ProductResponseDTO, ProductUpdateRequestDTO } from "../dtos/product.dto";
import { BadRequestError, NotFoundError, ConflictError } from "../errors";
import * as ProductRepository from "../repositories/product.repository";
import { getCategoryById } from "../repositories/product-category.repository";
import { SystemLogRepository } from "../repositories/system-log.repository";
import { LogLevel } from "../infra/logger/logger.interface";

async function getAllProducts(): Promise<ProductResponseDTO[]> {
    return await ProductRepository.getAllProducts();
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

        const savedProduct = await ProductRepository.saveProduct(product);

        await SystemLogRepository.save({
            level: LogLevel.INFO,
            message: "Product created",
            status_code: 201,
            entity_name: "product",
            entity_id: savedProduct.id,
            action: "CREATE",
            metadata: { ...data }
        });

        return savedProduct;

    } catch (error: any) {
        await SystemLogRepository.save({
            level: LogLevel.ERROR,
            message: "Error creating product",
            status_code: 500,
            entity_name: "product",
            action: "CREATE",
            metadata: { error: error.message, data: { ...data } }
        });

        if (error instanceof BadRequestError || error instanceof NotFoundError || error instanceof ConflictError) {
            throw error;
        }

        throw error;
    }
}

async function updateProduct(data: ProductUpdateRequestDTO): Promise<ProductResponseDTO> {
    try {
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

        const updatedProduct = await ProductRepository.saveProduct(existingProduct);

        await SystemLogRepository.save({
            level: LogLevel.INFO,
            message: "Product updated",
            status_code: 200,
            entity_name: "product",
            entity_id: updatedProduct.id,
            action: "UPDATE",
            metadata: { ...data }
        });

        return updatedProduct;

    } catch (error: any) {
        await SystemLogRepository.save({
            level: LogLevel.ERROR,
            message: "Error updating product",
            status_code: 500,
            entity_name: "product",
            entity_id: data.id,
            action: "UPDATE",
            metadata: { error: error.message }
        });

        throw error;
    }
}

async function deleteProduct(id: number): Promise<boolean> {
    try {
        const product = await ProductRepository.getProductById(id);

        if (!product) {
            throw new NotFoundError("Product not found");
        }

        await ProductRepository.deleteProduct(id);

        await SystemLogRepository.save({
            level: LogLevel.INFO,
            message: "Product deleted",
            status_code: 200,
            entity_name: "product",
            entity_id: id,
            action: "DELETE"
        });

        return true;

    } catch (error: any) {
        await SystemLogRepository.save({
            level: LogLevel.ERROR,
            message: "Error deleting product",
            status_code: 500,
            entity_name: "product",
            entity_id: id,
            action: "DELETE",
            metadata: { error: error.message }
        });

        throw error;
    }
}

export { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };