import { Router } from "express";
import { createUser, getUsers, getUserById, updateUser, changePassword, deleteUser, restoreUser } from "../controllers/user.controller";
import { asyncHandler } from "../utils/async-handler";
import { Endpoints } from "../utils/constants/endpoints";
import { paginationMiddleware } from "../middlewares/pagination.middleware";
import { getUserLogs } from "../controllers/system-log.controller";

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Users
 *     description: User management endpoints
 */

/**
 * @openapi
 * /api/users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Create a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequestDto'
 *     responses:
 *       201:
 *         description: Created user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponseDto'
 *       400:
 *         description: Validation or request error
 *       409:
 *         description: Username or email already exists
 */
router.post(Endpoints.USERS.CREATE, asyncHandler(createUser));

/**
 * @openapi
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: List users
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter users by name
 *       - in: query
 *         name: onlyActive
 *         schema:
 *           type: boolean
 *         description: Filter only active users
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserResponseDto'
 */
router.get(Endpoints.USERS.GET_ALL, paginationMiddleware, asyncHandler(getUsers));

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get a user by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponseDto'
 *       404:
 *         description: User not found
 */
router.get(Endpoints.USERS.GET_BY_ID, asyncHandler(getUserById));

/**
 * @openapi
 * /api/users/{id}/password:
 *   put:
 *     tags:
 *       - Users
 *     summary: Change user password
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ChangePasswordRequestDto'
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponseDto'
 *       404:
 *         description: User not found
 */

router.get(
    "/:id/logs",
    asyncHandler(getUserLogs)
);

router.put(Endpoints.USERS.CHANGE_PASSWORD, asyncHandler(changePassword));

/**
 * @openapi
 * /api/users/{id}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update user details
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequestDto'
 *     responses:
 *       200:
 *         description: Updated user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponseDto'
 *       404:
 *         description: User not found
 *       409:
 *         description: Username or email already exists
 */
router.put(Endpoints.USERS.UPDATE, asyncHandler(updateUser));

/**
 * @openapi
 * /api/users/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete a user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeleteUserRequestDto'
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete(Endpoints.USERS.DELETE, asyncHandler(deleteUser));

/**
 * @openapi
 * /api/users/{id}/restore:
 *   post:
 *     tags:
 *       - Users
 *     summary: Restore a deleted user
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               updatedBy:
 *                 type: integer
 *     responses:
 *       200:
 *         description: User restored successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponseDto'
 *       400:
 *         description: User is not deleted
 *       404:
 *         description: User not found
 */
router.post(Endpoints.USERS.RESTORE, asyncHandler(restoreUser));

export default router;
