import { Router } from "express";
import { ProductCategoryController } from "../controllers/product-category.controller";
import { Endpoints } from "../utils/constants/endpoints";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductCategoryParentDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The id of the parent category
 *         name:
 *           type: string
 *           description: The name of the parent category
 *         description:
 *           type: string
 *           nullable: true
 *           description: Description of the parent category
 *         deleted_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Deletion timestamp of the parent category
 *     ProductCategoryResponseDto:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: The auto-generated id of the product category
 *         name:
 *           type: string
 *           description: The name of the product category
 *         description:
 *           type: string
 *           nullable: true
 *           description: Detailed description of the product category
 *         deleted_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Deletion timestamp (for soft delete)
 *         parent:
 *           nullable: true
 *           description: The parent category object
 *           allOf:
 *             - $ref: '#/components/schemas/ProductCategoryParentDto'
 *     CreateProductCategoryDto:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the product category
 *         description:
 *           type: string
 *           description: Detailed description of the product category
 *         parent_id:
 *           type: string
 *           format: uuid
 *           description: The id of the parent category (optional)
 *     UpdateProductCategoryDto:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the product category
 *         description:
 *           type: string
 *           description: Detailed description of the product category
 *         parent_id:
 *           type: string
 *           format: uuid
 *           nullable: true
 *           description: The id of the parent category (null to remove parent)
 *     DeleteSuccessResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Success message
 *           example: Product category deleted successfully
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message
 */

/**
 * @swagger
 * tags:
 *   name: Product Categories
 *   description: The product categories managing API
 */

/**
 * @swagger
 * /api/product-categories:
 *   post:
 *     summary: Create a new product category
 *     tags: [Product Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductCategoryDto'
 *     responses:
 *       201:
 *         description: The created product category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductCategoryResponseDto'
 *       400:
 *         description: Failed to create category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(Endpoints.PRODUCT_CATEGORIES.CREATE, ProductCategoryController.create);

/**
 * @swagger
 * /api/product-categories:
 *   get:
 *     summary: Returns the list of all product categories
 *     tags: [Product Categories]
 *     parameters:
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         required: false
 *         description: If true, returns only active (non-deleted) categories
 *     responses:
 *       200:
 *         description: The list of product categories
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ProductCategoryResponseDto'
 *       500:
 *         description: Failed to retrieve categories
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(Endpoints.PRODUCT_CATEGORIES.GET_ALL, ProductCategoryController.getAll);

/**
 * @swagger
 * /api/product-categories/{id}:
 *   get:
 *     summary: Get a product category by id
 *     tags: [Product Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The product category id
 *     responses:
 *       200:
 *         description: The product category description by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductCategoryResponseDto'
 *       404:
 *         description: Product category not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Failed to retrieve category by ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(Endpoints.PRODUCT_CATEGORIES.GET_BY_ID, ProductCategoryController.getById);

/**
 * @swagger
 * /api/product-categories/{id}:
 *   put:
 *     summary: Update a product category
 *     tags: [Product Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The product category id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProductCategoryDto'
 *     responses:
 *       200:
 *         description: The updated product category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductCategoryResponseDto'
 *       400:
 *         description: Failed to update category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Product category not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put(Endpoints.PRODUCT_CATEGORIES.UPDATE, ProductCategoryController.update);

/**
 * @swagger
 * /api/product-categories/{id}:
 *   delete:
 *     summary: Soft delete a product category
 *     tags: [Product Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The product category id
 *     responses:
 *       200:
 *         description: Product category deleted successfully (soft delete)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteSuccessResponse'
 *       404:
 *         description: Product category not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Failed to delete category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete(Endpoints.PRODUCT_CATEGORIES.DELETE, ProductCategoryController.delete);

/**
 * @swagger
 * /api/product-categories/{id}/restore:
 *   patch:
 *     summary: Restore a soft-deleted product category
 *     tags: [Product Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *           format: uuid
 *         required: true
 *         description: The product category id
 *     responses:
 *       200:
 *         description: The restored product category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductCategoryResponseDto'
 *       404:
 *         description: Product category not found or not deleted
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Failed to restore category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch(Endpoints.PRODUCT_CATEGORIES.RESTORE, ProductCategoryController.restore);

export default router;
