import { Request, Response } from "express";
import { getAllProducts as serviceGetAllProducts, getProductById as serviceGetProductById, createProduct as serviceCreateProduct, updateProduct as serviceUpdateProduct, deleteProductService } from "../services/product.service";
import { CreateProductRequestDTO, ProductResponseDTO } from "../dtos/product.dto";

async function getAllProducts(req: Request<{}, ProductResponseDTO[], {}>, res: Response<ProductResponseDTO[]>) {
    const products = await serviceGetAllProducts();
    res.status(200).json(products);
}

async function getProductById(req: Request<{ id: string }, ProductResponseDTO, {}>, res: Response<ProductResponseDTO>) {
    const id = Number(req.params.id);
    const product = await serviceGetProductById(id);
    res.status(200).json(product);
}

async function createProduct(req: Request<{}, ProductResponseDTO, CreateProductRequestDTO>, res: Response<ProductResponseDTO>) {
    const newProduct = await serviceCreateProduct(req.body);
    res.status(201).json(newProduct);
}

async function updateProduct(req: Request<{ id: string }, ProductResponseDTO, any>, res: Response<ProductResponseDTO>) {
    const id = Number(req.params.id);
    const updatedProduct = await serviceUpdateProduct({ id, ...req.body });
    res.status(200).json(updatedProduct);
}

async function deleteProduct(req: Request<{ id: string }, {}, {}>, res: Response<{ message: string }>) {
    const id = Number(req.params.id);
    const deletedProduct = await deleteProductService(id);
    res.status(200).json({ message: "Product deleted successfully" });
}

export { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };

