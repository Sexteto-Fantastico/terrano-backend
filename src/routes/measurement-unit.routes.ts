import { Router } from "express";
import { getAll, getById, create, update, remove, restore } from "../controllers/measurement-unit.controller";
import { Endpoints } from "../utils/constants/endpoints";
import { asyncHandler } from "../utils/async-handler";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Measurement Units
 *   description: Measurement unit management endpoints
 */

/**
 * @swagger
 * /api/measurement-units:
 *   get:
 *     summary: Retrieve a list of measurement units
 *     tags: [Measurement Units]
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by unit name
 *       - in: query
 *         name: activeOnly
 *         schema:
 *           type: boolean
 *         description: Filter active units only. Defaults to true.
 *     responses:
 *       200:
 *         description: A list of measurement units
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MeasurementUnitResponseDto'
 */
router.get(Endpoints.MEASUREMENT_UNITS.GET_ALL, asyncHandler(getAll));

/**
 * @swagger
 * /api/measurement-units/{id}:
 *   get:
 *     summary: Get a measurement unit by ID
 *     tags: [Measurement Units]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Measurement unit ID
 *     responses:
 *       200:
 *         description: Measurement unit details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MeasurementUnitResponseDto'
 *       404:
 *         description: Measurement unit not found
 */
router.get(Endpoints.MEASUREMENT_UNITS.GET_BY_ID, asyncHandler(getById));

/**
 * @swagger
 * /api/measurement-units:
 *   post:
 *     summary: Create a new measurement unit
 *     tags: [Measurement Units]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMeasurementUnitDto'
 *     responses:
 *       201:
 *         description: The created measurement unit
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MeasurementUnitResponseDto'
 *       400:
 *         description: Invalid input or missing fields
 *       409:
 *         description: Measurement unit with the given name already exists
 */
router.post(Endpoints.MEASUREMENT_UNITS.CREATE, asyncHandler(create));

/**
 * @swagger
 * /api/measurement-units/{id}:
 *   put:
 *     summary: Update an existing measurement unit
 *     tags: [Measurement Units]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Measurement unit ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMeasurementUnitDto'
 *     responses:
 *       200:
 *         description: The updated measurement unit
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MeasurementUnitResponseDto'
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Measurement unit not found
 *       409:
 *         description: Measurement unit with the given name already exists
 */
router.put(Endpoints.MEASUREMENT_UNITS.UPDATE, asyncHandler(update));

/**
 * @swagger
 * /api/measurement-units/{id}:
 *   delete:
 *     summary: Deactivate a measurement unit (soft delete)
 *     tags: [Measurement Units]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Measurement unit ID
 *     responses:
 *       204:
 *         description: Successfully deactivated
 *       400:
 *         description: Measurement unit is already deactivated
 *       404:
 *         description: Measurement unit not found
 */
router.delete(Endpoints.MEASUREMENT_UNITS.DELETE, asyncHandler(remove));

/**
 * @swagger
 * /api/measurement-units/{id}/restore:
 *   post:
 *     summary: Restore a deactivated measurement unit
 *     tags: [Measurement Units]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Measurement unit ID
 *     responses:
 *       200:
 *         description: Successfully restored
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MeasurementUnitResponseDto'
 *       400:
 *         description: Measurement unit is not deactivated
 *       404:
 *         description: Measurement unit not found
 */
router.post(Endpoints.MEASUREMENT_UNITS.RESTORE, asyncHandler(restore));

export default router;
