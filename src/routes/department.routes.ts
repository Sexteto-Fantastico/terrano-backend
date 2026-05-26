import { Router } from "express";
import { z } from "zod";
import {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
  restoreDepartment,
} from "../controllers/department.controller";
import {
  Endpoints,
  HttpMethod,
  ContentType,
} from "../utils/constants/endpoints";
import { createRoute } from "../utils/route-builder";
import {
  CreateDepartmentBodySchema,
  UpdateDepartmentBodySchema,
  DepartmentResponseSchema,
  departmentIdSchema,
  departmentQuerySchema,
} from "../dtos/department.dto";

const router = Router();

createRoute(
  router,
  {
    method: HttpMethod.POST,
    path: Endpoints.DEPARTMENTS.CREATE,
    basePath: Endpoints.DEPARTMENTS.BASE,
    tags: ["Departments"],
    summary: "Create a new department",
    request: {
      body: {
        content: { [ContentType.JSON]: { schema: CreateDepartmentBodySchema } },
      },
    },
    responses: {
      201: {
        description: "The created department",
        content: { [ContentType.JSON]: { schema: DepartmentResponseSchema } },
      },
    },
  },
  createDepartment
);

createRoute(
  router,
  {
    method: HttpMethod.GET,
    path: Endpoints.DEPARTMENTS.GET_ALL,
    basePath: Endpoints.DEPARTMENTS.BASE,
    tags: ["Departments"],
    summary: "Returns the list of all departments",
    request: {
      query: departmentQuerySchema.shape.query,
    },
    responses: {
      200: {
        description: "The list of departments",
        content: {
          [ContentType.JSON]: { schema: z.array(DepartmentResponseSchema) },
        },
      },
    },
  },
  getAllDepartments
);

createRoute(
  router,
  {
    method: HttpMethod.GET,
    path: Endpoints.DEPARTMENTS.GET_BY_ID,
    basePath: Endpoints.DEPARTMENTS.BASE,
    tags: ["Departments"],
    summary: "Get a department by id",
    request: {
      params: departmentIdSchema.shape.params,
    },
    responses: {
      200: {
        description: "The department",
        content: { [ContentType.JSON]: { schema: DepartmentResponseSchema } },
      },
      404: { description: "Department not found" },
    },
  },
  getDepartmentById
);

createRoute(
  router,
  {
    method: HttpMethod.PUT,
    path: Endpoints.DEPARTMENTS.UPDATE,
    basePath: Endpoints.DEPARTMENTS.BASE,
    tags: ["Departments"],
    summary: "Update a department",
    request: {
      params: departmentIdSchema.shape.params,
      body: {
        content: { [ContentType.JSON]: { schema: UpdateDepartmentBodySchema } },
      },
    },
    responses: {
      200: {
        description: "The updated department",
        content: { [ContentType.JSON]: { schema: DepartmentResponseSchema } },
      },
      404: { description: "Department not found" },
    },
  },
  updateDepartment
);

createRoute(
  router,
  {
    method: HttpMethod.DELETE,
    path: Endpoints.DEPARTMENTS.DELETE,
    basePath: Endpoints.DEPARTMENTS.BASE,
    tags: ["Departments"],
    summary: "Soft delete a department",
    request: {
      params: departmentIdSchema.shape.params,
    },
    responses: {
      200: { description: "Department deleted successfully" },
    },
  },
  deleteDepartment
);

createRoute(
  router,
  {
    method: HttpMethod.PATCH,
    path: Endpoints.DEPARTMENTS.RESTORE,
    basePath: Endpoints.DEPARTMENTS.BASE,
    tags: ["Departments"],
    summary: "Restore a soft-deleted department",
    request: {
      params: departmentIdSchema.shape.params,
    },
    responses: {
      200: {
        description: "The restored department",
        content: { [ContentType.JSON]: { schema: DepartmentResponseSchema } },
      },
      404: { description: "Department not found" },
    },
  },
  restoreDepartment
);

export default router;
