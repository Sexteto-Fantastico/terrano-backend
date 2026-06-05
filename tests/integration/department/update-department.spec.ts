import "../../helpers/auth";
import "../../helpers/server";

import request from "supertest";
import { createTestApp } from "../../helpers/test-app";

import { TestDataSource } from "../../../src/infra/config/test-data-source";
import { Role } from "../../../src/infra/entities/role.entity";
import { User } from "../../../src/infra/entities/user.entity";
import { Department } from "../../../src/infra/entities/department.entity";

describe("Update Department", () => {

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

    it("should update a department name", async () => {
        const created = await request(app)
            .post("/departments")
            .send({ name: "TI", managerId: manager.id });

        const response = await request(app)
            .put(`/departments/${created.body.id}`)
            .send({ name: "Human Resources" });

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("Human Resources");
    });

    it("should update only the manager and keep other fields unchanged", async () => {
        const created = await request(app)
            .post("/departments")
            .send({ name: "TI", managerId: manager.id });

        const newManager = await TestDataSource.getRepository(User).save({
            name: "New Manager",
            email: "newmanager@test.com",
            username: "newmanager",
            password: "123456",
            role,
        });

        const response = await request(app)
            .put(`/departments/${created.body.id}`)
            .send({ managerId: newManager.id });

        expect(response.status).toBe(200);
        expect(response.body.managerId).toBe(newManager.id); 
        expect(response.body.name).toBe("TI");               
    });


    it("should return 404 when department does not exist", async () => {
        const response = await request(app)
            .put("/departments/999999")
            .send({ name: "New Name" });

        expect(response.status).toBe(404);
    });

    it("should return 404 when new managerId does not exist", async () => {
        const created = await request(app)
            .post("/departments")
            .send({ name: "TI", managerId: manager.id });

        const response = await request(app)
            .put(`/departments/${created.body.id}`)
            .send({ managerId: 999999 });

        expect(response.status).toBe(404);
    });

    it("should persist name update in database", async () => {
        const created = await request(app)
            .post("/departments")
            .send({ name: "TI", managerId: manager.id });

        await request(app)
            .put(`/departments/${created.body.id}`)
            .send({ name: "Human Resources" });

        const found = await TestDataSource.getRepository(Department)
            .findOneBy({ id: created.body.id });

        expect(found).not.toBeNull();
        expect(found!.name).toBe("Human Resources");
    });

});