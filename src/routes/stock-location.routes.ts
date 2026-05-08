import { Router } from "express";
import {
    createStockLocation,
    getAllStockLocations,
    getStockLocationById,
    updateStockLocation,
    deleteStockLocation,
    restoreStockLocation
} from "../controllers/stock-location.controller";
import { getStockLocationLogs } from "../controllers/system-log.controller";
import { Endpoints } from "../utils/constants/endpoints";
import { asyncHandler } from "../utils/async-handler";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     StockLocationResponseDto:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the stock location
 *         name:
 *           type: string
 *           description: The name of the stock location
 *         description:
 *           type: string
 *           nullable: true
 *           description: Detailed description of the stock location
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *         deleted_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *     CreateStockLocationDto:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the stock location
 *         description:
 *           type: string
 *           description: Detailed description of the stock location
 *     UpdateStockLocationDto:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 */

/**
 * @swagger
 * tags:
 *   name: Stock Locations
 *   description: The stock locations managing API
 */

/**
 * @swagger
 * /api/stock-locations:
 *   post:
 *     summary: Create a new stock location
 *     tags: [Stock Locations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateStockLocationDto'
 *     responses:
 *       201:
 *         description: The created stock location
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StockLocationResponseDto'
 */
router.post(Endpoints.STOCK_LOCATIONS.CREATE, asyncHandler(createStockLocation));

/**
 * @swagger
 * /api/stock-locations:
 *   get:
 *     summary: Returns the list of all stock locations
 *     tags: [Stock Locations]
 *     parameters:
 *       - in: query
 *         name: activeOnly
 *         schema:
 *           type: boolean
 *         required: false
 *         description: If true, returns only active (non-deleted) stock locations
 *     responses:
 *       200:
 *         description: The list of stock locations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StockLocationResponseDto'
 */
router.get(Endpoints.STOCK_LOCATIONS.GET_ALL, asyncHandler(getAllStockLocations));

/**
 * @swagger
 * /api/stock-locations/{id}:
 *   get:
 *     summary: Get a stock location by id
 *     tags: [Stock Locations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The stock location id
 *     responses:
 *       200:
 *         description: The stock location
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StockLocationResponseDto'
 *       404:
 *         description: Stock location not found
 */
router.get(Endpoints.STOCK_LOCATIONS.GET_BY_ID, asyncHandler(getStockLocationById));

/**
 * @swagger
 * /api/stock-locations/{id}:
 *   put:
 *     summary: Update a stock location
 *     tags: [Stock Locations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The stock location id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateStockLocationDto'
 *     responses:
 *       200:
 *         description: The updated stock location
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StockLocationResponseDto'
 *       404:
 *         description: Stock location not found
 */

router.get(
    "/:id/logs",
    asyncHandler(getStockLocationLogs)
);

router.put(Endpoints.STOCK_LOCATIONS.UPDATE, asyncHandler(updateStockLocation));

/**
 * @swagger
 * /api/stock-locations/{id}:
 *   delete:
 *     summary: Soft delete a stock location
 *     tags: [Stock Locations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The stock location id
 *     responses:
 *       200:
 *         description: Stock location deleted successfully (soft delete)
 */
router.delete(Endpoints.STOCK_LOCATIONS.DELETE, asyncHandler(deleteStockLocation));

/**
 * @swagger
 * /api/stock-locations/{id}/restore:
 *   patch:
 *     summary: Restore a soft-deleted stock location
 *     tags: [Stock Locations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The stock location id
 *     responses:
 *       200:
 *         description: The restored stock location
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StockLocationResponseDto'
 *       404:
 *         description: Stock location not found
 */
router.patch(Endpoints.STOCK_LOCATIONS.RESTORE, asyncHandler(restoreStockLocation));

export default router;