import { Router } from "express";
import { SystemLogController } from "../controllers/system-log.controller";

const router = Router();
const controller = new SystemLogController();

router.get("/", controller.getLogs);
/**
 * @swagger
 * tags:
 *   name: Logs
 *   description: Generic system logs (audit)
 */

/**
 * @swagger
 * /logs:
 *   get:
 *     summary: Get logs by entity and/or entityId
 *     tags: [Logs]
 *     parameters:
 *       - in: query
 *         name: entity
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: entityId
 *         schema:
 *           type: integer
 *         required: false
 *     responses:
 *       200:
 *         description: List of logs
 */

export default router;