import { CreateProductRequestDTO, ProductResponseDTO, ProductUpdateRequestDTO, toProductResponseDTO, ProductQueryDTO } from "../dtos/product.dto";
import { BadRequestError, NotFoundError, ConflictError } from "../errors";
import * as ProductRepository from "../repositories/product.repository";
import { getCategoryById } from "../repositories/product-category.repository";
import { findMeasurementUnitById } from "../repositories/measurement-unit.repository";
import { getBrandById } from "../repositories/product-brand.repository";

async function getAllProducts(filters: ProductQueryDTO = {}): Promise<[ProductResponseDTO[], number]> {
    const [allProducts, total] = await ProductRepository.getAllProducts(filters);
    return [allProducts.map(toProductResponseDTO), total];
}

async function getProductById(id: number): Promise<ProductResponseDTO> {
    const product = await ProductRepository.getProductById(id, false);
    if (!product) {
        throw new NotFoundError("Product not found");
    }
    return toProductResponseDTO(product);
}

async function createProduct(data: CreateProductRequestDTO): Promise<ProductResponseDTO> {
    const existingProduct = await ProductRepository.getProductByCode(data.code);
    if (existingProduct) {
        throw new ConflictError("Product code already exists");
    }

    const measurementUnit = await findMeasurementUnitById(data.measurementUnitId);
    if (!measurementUnit) {
        throw new NotFoundError("Measurement Unit not found");
    }

    const category = await getCategoryById(data.categoryId);
    if (!category) {
        throw new NotFoundError("Category not found");
    }



    const brand = await getBrandById(data.brandId);
    if (!brand) {
        throw new NotFoundError("Brand not found");
    }

    const product = new (require("../infra/entities/product.entity").Product)({
        name: data.name.trim(),
        code: data.code.trim(),
        description: data.description?.trim(),
        measurement_unit: measurementUnit,
        category,
        brand,
        min_stock: data.minStock,
        max_stock: data.maxStock,
    });

    const savedProduct = await ProductRepository.saveProduct(product);
    return toProductResponseDTO(savedProduct);
}

async function updateProduct(data: ProductUpdateRequestDTO): Promise<ProductResponseDTO> {
    const existingProduct = await ProductRepository.getProductById(data.id, false);

    if (!existingProduct) {
        throw new NotFoundError("Product not found");
    }

    if (data.name !== undefined) {
        existingProduct.name = data.name.trim();
    }

    if (data.code !== undefined) {
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

    if (data.measurementUnitId !== undefined) {
        const measurementUnit = await findMeasurementUnitById(data.measurementUnitId);
        if (!measurementUnit) {
            throw new NotFoundError("Measurement Unit not found");
        }
        existingProduct.measurement_unit = measurementUnit;
    }

    if (data.brandId !== undefined) {
        const brand = await getBrandById(data.brandId);
        if (!brand) {
            throw new NotFoundError("Brand not found");
        }
        existingProduct.brand = brand;
    }

    if (data.minStock !== undefined) {
        existingProduct.min_stock = data.minStock;
    }

    if (data.maxStock !== undefined) {
        existingProduct.max_stock = data.maxStock;
    }

    const updatedProduct = await ProductRepository.saveProduct(existingProduct);
    return toProductResponseDTO(updatedProduct);
}

async function deleteProduct(id: number): Promise<boolean> {
    const product = await ProductRepository.getProductById(id, false);

    if (!product) {
        throw new NotFoundError("Product not found");
    }

    await ProductRepository.deleteProduct(id);

    return true;
}

async function restoreProduct(id: number): Promise<ProductResponseDTO> {
    const product = await ProductRepository.getProductById(id, true);

    if (!product) {
        throw new NotFoundError("Product not found");
    }

    if (!product.deleted_at) {
        throw new BadRequestError("Product is not deleted");
    }

    await ProductRepository.restoreProduct(id);

    const restoredProduct = await ProductRepository.getProductById(id, true);
    return toProductResponseDTO(restoredProduct!);
}

export { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, restoreProduct };