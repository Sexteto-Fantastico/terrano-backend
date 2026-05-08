import { Router } from "express";
import {
    createDepartment,
    getAllDepartments,
    getDepartmentById,
    updateDepartment,
    deleteDepartment,
    restoreDepartment
} from "../controllers/department.controller";
import { Endpoints } from "../utils/constants/endpoints";
import { asyncHandler } from "../utils/async-handler";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     DepartmentResponseDto:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         costCenterCode:
 *           type: string
 *         managerId:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         deletedAt:
 *           type: string
 *           format: date-time
 *           nullable: true
 *     CreateDepartmentDto:
 *       type: object
 *       required:
 *         - name
 *         - costCenterCode
 *         - managerId
 *       properties:
 *         name:
 *           type: string
 *         costCenterCode:
 *           type: string
 *         managerId:
 *           type: integer
 *     UpdateDepartmentDto:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         costCenterCode:
 *           type: string
 *         managerId:
 *           type: integer
 */

/**
 * @swagger
 * tags:
 *   name: Departments
 *   description: The departments managing API
 */

/**
 * @swagger
 * /api/departments:
 *   post:
 *     summary: Create a new department
 *     tags: [Departments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDepartmentDto'
 *     responses:
 *       201:
 *         description: The created department
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DepartmentResponseDto'
 */
router.post(Endpoints.DEPARTMENTS.CREATE, asyncHandler(createDepartment));

/**
 * @swagger
 * /api/departments:
 *   get:
 *     summary: Returns the list of all departments
 *     tags: [Departments]
 *     parameters:
 *       - in: query
 *         name: activeOnly
 *         schema:
 *           type: boolean
 *         required: false
 *         description: If true, returns only active (non-deleted) departments
 *     responses:
 *       200:
 *         description: The list of departments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DepartmentResponseDto'
 */
router.get(Endpoints.DEPARTMENTS.GET_ALL, asyncHandler(getAllDepartments));

/**
 * @swagger
 * /api/departments/{id}:
 *   get:
 *     summary: Get a department by id
 *     tags: [Departments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: The department
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DepartmentResponseDto'
 *       404:
 *         description: Department not found
 */
router.get(Endpoints.DEPARTMENTS.GET_BY_ID, asyncHandler(getDepartmentById));

/**
 * @swagger
 * /api/departments/{id}:
 *   put:
 *     summary: Update a department
 *     tags: [Departments]
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
 *             $ref: '#/components/schemas/UpdateDepartmentDto'
 *     responses:
 *       200:
 *         description: The updated department
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DepartmentResponseDto'
 *       404:
 *         description: Department not found
 */
router.put(Endpoints.DEPARTMENTS.UPDATE, asyncHandler(updateDepartment));

/**
 * @swagger
 * /api/departments/{id}:
 *   delete:
 *     summary: Soft delete a department
 *     tags: [Departments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Department deleted successfully
 */
router.delete(Endpoints.DEPARTMENTS.DELETE, asyncHandler(deleteDepartment));

/**
 * @swagger
 * /api/departments/{id}/restore:
 *   patch:
 *     summary: Restore a soft-deleted department
 *     tags: [Departments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: The restored department
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DepartmentResponseDto'
 *       404:
 *         description: Department not found
 */
router.patch(Endpoints.DEPARTMENTS.RESTORE, asyncHandler(restoreDepartment));

export default router;