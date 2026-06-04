import "../../helpers/auth";
import "../../helpers/server";

import request from "supertest";
import { createTestApp } from "../../helpers/test-app";

import { TestDataSource } from "../../../src/infra/config/test-data-source";
import { Role } from "../../../src/infra/entities/role.entity";
import { User } from "../../../src/infra/entities/user.entity";

describe("Get Departments", () => {

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

    it("should return departments list", async () => {
        await request(app)
            .post("/departments")
            .send({ name: "TI", costCenterCode: "CC-001", managerId: manager.id });

        const response = await request(app).get("/departments");

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
    });

    it("should return empty list when no departments exist", async () => {
        const response = await request(app).get("/departments");

        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(0);
    });

    it("should return all created departments", async () => {
        await request(app)
            .post("/departments")
            .send({ name: "TI", costCenterCode: "CC-001", managerId: manager.id });

        await request(app)
            .post("/departments")
            .send({ name: "RH", costCenterCode: "CC-002", managerId: manager.id });

        const response = await request(app).get("/departments");

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
    });

    it("should return department with correct fields", async () => {
        await request(app)
            .post("/departments")
            .send({ name: "TI", costCenterCode: "CC-001", managerId: manager.id });

        const response = await request(app).get("/departments");
        const dept = response.body[0];

        expect(dept).toHaveProperty("id");
        expect(dept).toHaveProperty("name");
        expect(dept).toHaveProperty("costCenterCode"); 
        expect(dept).toHaveProperty("managerId");     
    });

    it("should return department by id", async () => {
        const created = await request(app)
            .post("/departments")
            .send({ name: "TI", costCenterCode: "CC-001", managerId: manager.id });

        const response = await request(app)
            .get(`/departments/${created.body.id}`);

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(created.body.id);
        expect(response.body.name).toBe("TI");
    });

    it("should return 404 when department id does not exist", async () => {
        const response = await request(app).get("/departments/999999");

        expect(response.status).toBe(404);
    });

    it("should return correct managerId inside department", async () => {
        await request(app)
            .post("/departments")
            .send({ name: "TI", costCenterCode: "CC-001", managerId: manager.id });

        const response = await request(app).get("/departments");
        const dept = response.body[0];

        expect(dept.managerId).toBe(manager.id); 
    });
});