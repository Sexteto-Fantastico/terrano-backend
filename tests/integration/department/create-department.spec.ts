import "../../helpers/auth";
import "../../helpers/server";

import request from "supertest";
import { createTestApp } from "../../helpers/test-app";

import { TestDataSource } from "../../../src/infra/config/test-data-source";
import { Role } from "../../../src/infra/entities/role.entity";
import { User } from "../../../src/infra/entities/user.entity";
import { Department } from "../../../src/infra/entities/department.entity";

describe("Create Department", () => {

    const app = createTestApp();
    let role: Role;
    let manager: User;

    beforeEach(async () => {
        role = await TestDataSource.getRepository(Role).save({ name: "Admin" });

        manager = await TestDataSource.getRepository(User).save({
            name: "Manager",
            email: "manager@test.com",
            username: "manager",
            password: "123456",
            role,
        });
    });

    it("should create a department", async () => {
        const response = await request(app)
            .post("/departments")
            .send({ name: "TI", managerId: manager.id });

        expect(response.status).toBe(201);
        expect(response.body.name).toBe("TI");
    });

    it("should return 400 when name is missing", async () => {
        const response = await request(app)
            .post("/departments")
            .send({ managerId: manager.id });

        expect(response.status).toBe(400);
    });


    it("should return 400 when managerId is missing", async () => {
        const response = await request(app)
            .post("/departments")
            .send({ name: "TI" });

        expect(response.status).toBe(400);
    });

    it("should return 400 when body is empty", async () => {
        const response = await request(app)
            .post("/departments")
            .send({});

        expect(response.status).toBe(400);
    });

    it("should return 404 when managerId does not exist", async () => {
        const response = await request(app)
            .post("/departments")
            .send({ name: "TI", managerId: 999999 });

        expect(response.status).toBe(404);
    });

    it("should persist the department in database after creation", async () => {
        const response = await request(app)
            .post("/departments")
            .send({ name: "TI", managerId: manager.id });

        const found = await TestDataSource.getRepository(Department)
            .findOneBy({ id: response.body.id });

        expect(found).not.toBeNull();
        expect(found!.name).toBe("TI");
    });

    it("should persist manager relation in database", async () => {
        const response = await request(app)
            .post("/departments")
            .send({ name: "TI", managerId: manager.id });

        const found = await TestDataSource.getRepository(Department)
            .findOne({ where: { id: response.body.id }, relations: ["manager"] });

        expect(found).not.toBeNull();
        expect(found!.manager).not.toBeNull();
        expect(found!.manager.id).toBe(manager.id);
    });
});