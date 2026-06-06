import "../../helpers/auth";
import "../../helpers/server";

import request from "supertest";
import { createTestApp } from "../../helpers/test-app";

import { TestDataSource } from "../../../src/infra/config/test-data-source";
import { Role } from "../../../src/infra/entities/role.entity";
import { User } from "../../../src/infra/entities/user.entity";
import { Department } from "../../../src/infra/entities/department.entity";

describe("Delete Department", () => {

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

    it("should delete a department", async () => {
        const created = await request(app)
            .post("/departments")
            .send({ name: "TI", managerId: manager.id });

        const response = await request(app)
            .delete(`/departments/${created.body.id}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: "Department deleted successfully" });
    });

    it("should set deletedAt in database after deletion", async () => {
        const created = await request(app)
            .post("/departments")
            .send({ name: "TI", managerId: manager.id });

        await request(app).delete(`/departments/${created.body.id}`);

        const found = await TestDataSource.getRepository(Department)
            .findOne({ where: { id: created.body.id }, withDeleted: true });

        expect(found).not.toBeNull();
        expect(found!.deleted_at).not.toBeNull();
    });

    it("should not affect other departments when deleting one", async () => {
        const first = await request(app)
            .post("/departments")
            .send({ name: "TI", managerId: manager.id });

        const second = await request(app)
            .post("/departments")
            .send({ name: "RH", managerId: manager.id });

        await request(app).delete(`/departments/${first.body.id}`);

        const found = await TestDataSource.getRepository(Department)
            .findOneBy({ id: second.body.id });

        expect(found).not.toBeNull();
        expect(found!.name).toBe("RH");
    });
});