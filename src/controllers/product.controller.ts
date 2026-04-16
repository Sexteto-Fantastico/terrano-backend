import { Request, Response } from "express";
import * as ProductService from "../services/product.service";
import { CreateProductRequestDTO, ProductResponseDTO } from "../dtos/product.dto";

async function getAllProducts(req: Request<{}, ProductResponseDTO[], {}>, res: Response<ProductResponseDTO[]>) {
    const products = await ProductService.getAllProducts();
    res.status(200).json(products);
}

async function getProductById(req: Request<{ id: string }, ProductResponseDTO, {}>, res: Response<ProductResponseDTO>) {
    const id = Number(req.params.id);
    const product = await ProductService.getProductById(id);
    res.status(200).json(product);
}

async function createProduct(req: Request<{}, ProductResponseDTO, CreateProductRequestDTO>, res: Response<ProductResponseDTO>) {
    const newProduct = await ProductService.createProduct(req.body);
    res.status(201).json(newProduct);
}

async function updateProduct(req: Request<{ id: string }, ProductResponseDTO, any>, res: Response<ProductResponseDTO>) {
    const id = Number(req.params.id);
    const updatedProduct = await ProductService.updateProduct({ id, ...req.body });
    res.status(200).json(updatedProduct);
}

async function deleteProduct(req: Request<{ id: string }, {}, {}>, res: Response<{ message: string }>) {
    const id = Number(req.params.id);
    const deletedProduct = await ProductService.deleteProduct(id);
    res.status(200).json({ message: "Product deleted successfully" });
}

export { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };

