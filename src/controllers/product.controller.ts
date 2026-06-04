import { Request, Response } from "express";
import * as ProductService from "../services/product.service";
import { CreateProductBody, ProductResponse, ProductQuery } from "../dtos/product.dto";

async function getAllProducts(req: Request<{}, ProductResponse[], {}, ProductQuery>, res: Response<ProductResponse[]>) {
    const [products, total] = await ProductService.getAllProducts(req.query);
    res.set("X-Total-Count", total.toString());
    res.status(200).json(products);
}

async function getProductById(req: Request<{ id: string }, ProductResponse, {}>, res: Response<ProductResponse>) {
    const id = Number(req.params.id);
    const product = await ProductService.getProductById(id);
    res.status(200).json(product);
}

async function createProduct(req: Request<{}, ProductResponse, CreateProductBody>, res: Response<ProductResponse>) {
    const newProduct = await ProductService.createProduct(req.body);
    res.status(201).json(newProduct);
}

async function updateProduct(req: Request<{ id: string }, ProductResponse, any>, res: Response<ProductResponse>) {
    const id = Number(req.params.id);
    const updatedProduct = await ProductService.updateProduct({ id, ...req.body });
    res.status(200).json(updatedProduct);
}

async function deleteProduct(req: Request<{ id: string }>, res: Response) {
    const id = Number(req.params.id);
    await ProductService.deleteProduct(id);
    res.status(204).send();
}

async function restoreProduct(req: Request<{ id: string }, ProductResponse>, res: Response<ProductResponse>) {
    const id = Number(req.params.id);
    const restoredProduct = await ProductService.restoreProduct(id);
    res.status(200).json(restoredProduct);
}

export { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, restoreProduct };

