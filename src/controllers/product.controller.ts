import { Request, Response } from "express";
import ProductService from "../services/product.service";
import { CreateProductRequestDTO, ProductResponseDTO } from "../dtos/product.dto";

export class ProductController {
    private readonly productService: ProductService;

    constructor(productService: ProductService) {
        this.productService = productService;
    }

    async getAllProducts(req: Request<{}, ProductResponseDTO[], {}>, res: Response<ProductResponseDTO[]>) {
        const products = await this.productService.getAllProducts();
        res.status(200).json(products);
    }

    async getProductById(req: Request<{ id: string }, ProductResponseDTO, {}>, res: Response<ProductResponseDTO>) {
        const id = Number(req.params.id);
        const product = await this.productService.getProductById(id);
        res.status(200).json(product);
    }

    async createProduct(req: Request<{}, ProductResponseDTO, CreateProductRequestDTO>, res: Response<ProductResponseDTO>) {
        const newProduct = await this.productService.createProduct(req.body);
        res.status(201).json(newProduct);
    }

    async updateProduct(req: Request<{ id: string }, ProductResponseDTO, any>, res: Response<ProductResponseDTO>) {
        const id = Number(req.params.id);
        const updatedProduct = await this.productService.updateProduct({ id, ...req.body });
        res.status(200).json(updatedProduct);
    }

    async deleteProduct(req: Request<{ id: string }, {}, {}>, res: Response<{ message: string }>) {
        const id = Number(req.params.id);
        const deletedProduct = await this.productService.deleteProduct(id);
        res.status(200).json({ message: "Product deleted successfully" });
    }
}

