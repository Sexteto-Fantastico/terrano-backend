import { Router } from "express";
import { createProductBrand, getAllProductBrands, getProductBrandById, updateProductBrand, deleteProductBrand, restoreProductBrand } from "../controllers/product-brand.controller";
import { Endpoints } from "../utils/constants/endpoints";
import { asyncHandler } from "../utils/async-handler";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductBrandResponseDto:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the product brand
 *         name:
 *           type: string
 *           description: The name of the product brand
 *         isActive:
 *           type: boolean
 *           description: Whether the brand is active
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Deletion timestamp (for soft delete)
 *     CreateProductBrandDto:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the product brand
 *     UpdateProductBrandDto:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the product brand
 */

/**
 * @swagger
 * tags:
 *   name: Product Brands
 *   description: The product brands managing API
 */

/**
 * @swagger
 * /api/product-brands:
 *   post:
 *     summary: Create a new product brand
 *     tags: [Product Brands]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductBrandDto'
 *     responses:
 *       201:
 *         description: The created product brand
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductBrandResponseDto'
 *       400:
 *         description: Failed to create brand
 */
router.post(Endpoints.PRODUCT_BRANDS.CREATE, asyncHandler(createProductBrand));

/**
 * @swagger
 * /api/product-brands:
 *   get:
 *     summary: Returns the list of all product brands
 *     tags: [Product Brands]
 *     parameters:
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         required: false
 *         description: If true, returns only active (non-deleted) brands
 *     responses:
 *       200:
 *         description: The list of product brands
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductBrandResponseDto'
 */
router.get(Endpoints.PRODUCT_BRANDS.GET_ALL, asyncHandler(getAllProductBrands));

/**
 * @swagger
 * /api/product-brands/{id}:
 *   get:
 *     summary: Get a product brand by id
 *     tags: [Product Brands]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The product brand id
 *     responses:
 *       200:
 *         description: The product brand description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductBrandResponseDto'
 *       404:
 *         description: Product brand not found
 */
router.get(Endpoints.PRODUCT_BRANDS.GET_BY_ID, asyncHandler(getProductBrandById));

/**
 * @swagger
 * /api/product-brands/{id}:
 *   put:
 *     summary: Update a product brand
 *     tags: [Product Brands]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The product brand id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProductBrandDto'
 *     responses:
 *       200:
 *         description: The updated product brand
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductBrandResponseDto'
 *       404:
 *         description: Product brand not found
 */
router.put(Endpoints.PRODUCT_BRANDS.UPDATE, asyncHandler(updateProductBrand));

/**
 * @swagger
 * /api/product-brands/{id}:
 *   delete:
 *     summary: Soft delete a product brand
 *     tags: [Product Brands]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The product brand id
 *     responses:
 *       200:
 *         description: Product brand deleted successfully (soft delete)
 */
router.delete(Endpoints.PRODUCT_BRANDS.DELETE, asyncHandler(deleteProductBrand));

/**
 * @swagger
 * /api/product-brands/{id}/restore:
 *   patch:
 *     summary: Restore a soft-deleted product brand
 *     tags: [Product Brands]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The product brand id
 *     responses:
 *       200:
 *         description: The restored product brand
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductBrandResponseDto'
 *       404:
 *         description: Product brand not found
 */
router.patch(Endpoints.PRODUCT_BRANDS.RESTORE, asyncHandler(restoreProductBrand));

export default router;