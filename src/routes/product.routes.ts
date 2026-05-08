import { Router } from "express";
import { asyncHandler } from "../utils/async-handler";
import { Endpoints } from "../utils/constants/endpoints";
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from "../controllers/product.controller";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductCategoryResponseDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *     ProductResponseDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         code:
 *           type: string
 *         description:
 *           type: string
 *           nullable: true
 *         category:
 *           $ref: '#/components/schemas/ProductCategoryResponseDTO'
 *         minStock:
 *           type: integer
 *           nullable: true
 *         createdAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *     CreateProductRequestDTO:
 *       type: object
 *       required:
 *         - name
 *         - code
 *         - categoryId
 *       properties:
 *         name:
 *           type: string
 *         code:
 *           type: string
 *         description:
 *           type: string
 *         categoryId:
 *           type: integer
 *         minStock:
 *           type: integer
 *     ProductUpdateRequestDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         code:
 *           type: string
 *         description:
 *           type: string
 *         categoryId:
 *           type: integer
 *         minStock:
 *           type: integer
 */

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: The products managing API
 */

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductRequestDTO'
 *     responses:
 *       201:
 *         description: The created product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponseDTO'
 *       400:
 *         description: Validation error
 */
router.post(Endpoints.PRODUCTS.CREATE, asyncHandler(createProduct));

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Returns the list of all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: The list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductResponseDTO'
 */
router.get(Endpoints.PRODUCTS.GET_ALL, asyncHandler(getAllProducts));

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: The product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponseDTO'
 *       404:
 *         description: Product not found
 */
router.get(Endpoints.PRODUCTS.GET_BY_ID, asyncHandler(getProductById));

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductUpdateRequestDTO'
 *     responses:
 *       200:
 *         description: The updated product
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductResponseDTO'
 *       404:
 *         description: Product not found
 */
router.put(Endpoints.PRODUCTS.UPDATE, asyncHandler(updateProduct));

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
router.delete(Endpoints.PRODUCTS.DELETE, asyncHandler(deleteProduct));

export default router;