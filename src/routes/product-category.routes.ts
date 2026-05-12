import { Router } from "express";
import { createProductCategory, getAllProductCategories, getProductCategoryById, updateProductCategory, deleteProductCategory, restoreProductCategory } from "../controllers/product-category.controller";
import { Endpoints } from "../utils/constants/endpoints";
import { asyncHandler } from "../utils/async-handler";
import { paginationMiddleware } from "../middlewares/pagination.middleware";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductCategoryParentDto:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The id of the parent category
 *         name:
 *           type: string
 *           description: The name of the parent category
 *         description:
 *           type: string
 *           nullable: true
 *           description: Description of the parent category
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           description: Deletion timestamp of the parent category
 *     ProductCategoryResponseDto:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the product category
 *         name:
 *           type: string
 *           description: The name of the product category
 *         description:
 *           type: string
 *           nullable: true
 *           description: Detailed description of the product category
 *         deletedAt:
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
 *         parentId:
 *           type: integer
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
 *         parentId:
 *           type: integer
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
 *         statusCode:
 *           type: integer
 *           description: HTTP status code
 *         message:
 *           type: string
 *           description: Error message
 *         timestamp:
 *           type: string
 *           format: date-time
 *           description: Timestamp of the error
 *         path:
 *           type: string
 *           description: Request path that caused the error
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
router.post(Endpoints.PRODUCT_CATEGORIES.CREATE, asyncHandler(createProductCategory));

/**
 * @swagger
 * /api/product-categories:
 *   get:
 *     summary: Returns the list of all product categories
 *     tags: [Product Categories]
 *     parameters:
 *       - in: query
 *         name: activeOnly
 *         schema:
 *           type: boolean
 *         required: false
 *         description: If true, returns only active (non-deleted) categories
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: false
 *         description: Filter categories by name (partial match)
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
router.get(Endpoints.PRODUCT_CATEGORIES.GET_ALL, asyncHandler(getAllProductCategories));

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
 *           type: integer
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
router.get(Endpoints.PRODUCT_CATEGORIES.GET_BY_ID, asyncHandler(getProductCategoryById));

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
 *           type: integer
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
router.put(Endpoints.PRODUCT_CATEGORIES.UPDATE, asyncHandler(updateProductCategory));

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
 *           type: integer
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
router.delete(Endpoints.PRODUCT_CATEGORIES.DELETE, asyncHandler(deleteProductCategory));

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
 *           type: integer
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
router.patch(Endpoints.PRODUCT_CATEGORIES.RESTORE, asyncHandler(restoreProductCategory));

export default router;
