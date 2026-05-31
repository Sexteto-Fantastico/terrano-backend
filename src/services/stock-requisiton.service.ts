import { BadRequestError, NotFoundError } from "../errors";

import * as StockRequisitionRepository from "../repositories/stock-requisition.repository";
import * as StockRequisitionItemRepository from "../repositories/stock-requisition-item.repository";
import * as ProductRepository from "../repositories/product.repository";
import * as DepartmentRepository from "../repositories/department.repository";
import * as StockMovementOutputRepository from "../repositories/stock-movement-output.repository";
import * as StockMovementRepository from "../repositories/stock-movement.repository";

import { AppDataSource } from "../infra/config/data-source";
import { StockRequisition, RequisitionStatus } from "../infra/entities/stock-requisition.entity";
import { StockRequisitionItem } from "../infra/entities/stock-requisition-item.entity";
import { StockMovementOutput } from "../infra/entities/stock-movement-output.entity";
import { StockMovement, MovementType } from "../infra/entities/stock-movement.entity";

type CreateStockRequisitionDto = any;
type UpdateStockRequisitionDto = any;


async function getAllStockRequisitions(filters: any = {}) {
    return await StockRequisitionRepository.getAllStockRequisitions(filters);
}


async function getStockRequisitionById(id: number) {
    const requisition =
        await StockRequisitionRepository.getStockRequisitionById(id);

    if (!requisition) {
        throw new NotFoundError("Stock requisition not found");
    }

    return requisition;
}

async function createStockRequisition(data: CreateStockRequisitionDto) {

    return await AppDataSource.manager.transaction(async (manager) => {

        const department =
            await DepartmentRepository.getDepartmentById(data.departmentId);

        if (!department) {
            throw new NotFoundError("Department not found");
        }

        const requisition = new StockRequisition({
            company_name: data.companyName,
            declared_at: new Date(data.declaredAt),
            status: RequisitionStatus.PENDING,
            total_value: 0,
            department,
        });

        const savedRequisition =
            await manager.save(requisition);

        let total = 0;

        if (!Array.isArray(data.items)) {
            throw new BadRequestError("Items must be an array");
        }

        for (const it of data.items) {

            const product =
                await ProductRepository.getProductById(it.productId);

            if (!product) {
                throw new NotFoundError("Product not found");
            }

            const item = new StockRequisitionItem({
                item: product.name,
                declared_at: new Date(),
                product,
                quantity: it.quantity,
                delivered: 0,
                requisition: savedRequisition,
            });

            await manager.save(item);

            const cost = product.cost ?? 0;
            total += it.quantity * cost;
        }

        savedRequisition.total_value = total;

        await manager.save(savedRequisition);

        return savedRequisition;
    });
}

async function updateStockRequisition(id: number, data: UpdateStockRequisitionDto) {

    const requisition =
        await StockRequisitionRepository.getStockRequisitionById(id);

    if (!requisition) {
        throw new NotFoundError("Stock requisition not found");
    }

    if (requisition.status !== RequisitionStatus.PENDING) {
        throw new BadRequestError("Only pending requisitions can be updated");
    }

    if (data.companyName !== undefined) {
        requisition.company_name = data.companyName;
    }

    if (data.departmentId !== undefined) {

        const department =
            await DepartmentRepository.getDepartmentById(data.departmentId);

        if (!department) {
            throw new NotFoundError("Department not found");
        }

        requisition.department = department;
    }

    return await StockRequisitionRepository.saveStockRequisition(requisition);
}

async function approveStockRequisition(id: number) {

    return await AppDataSource.manager.transaction(async (manager) => {

        const requisition =
            await StockRequisitionRepository.getStockRequisitionById(id);

        if (!requisition) {
            throw new NotFoundError("Stock requisition not found");
        }

        if (requisition.status !== RequisitionStatus.PENDING) {
            throw new BadRequestError("Requisition is not pending");
        }

        requisition.status = RequisitionStatus.APPROVED;

        const output = new StockMovementOutput({
            requisition,
        });

        const savedOutput =
            await manager.save(output);

        const items =
            await StockRequisitionItemRepository.getItemsByRequisitionId(id);

        for (const item of items) {

            const movement = new StockMovement({
                product: item.product,
                location: (requisition.department as any),
                movement_type: MovementType.OUT,
                quantity: item.quantity,
                unit_cost: 0,
                requisition: requisition,
                purchase_order: null,
            });

            await manager.save(movement);

            item.delivered += item.quantity;

            await manager.save(item);
        }

        requisition.status = RequisitionStatus.COMPLETED;

        await manager.save(requisition);

        return savedOutput;
    });
}

async function deleteStockRequisition(id: number) {

    const requisition =
        await StockRequisitionRepository.getStockRequisitionById(id, true);

    if (!requisition) {
        throw new NotFoundError("Stock requisition not found");
    }

    await StockRequisitionRepository.deleteStockRequisition(requisition);

    return true;
}

async function restoreStockRequisition(id: number) {

    const requisition =
        await StockRequisitionRepository.getStockRequisitionById(id, true);

    if (!requisition) {
        throw new NotFoundError("Stock requisition not found");
    }

    await StockRequisitionRepository.restoreStockRequisition(requisition);

    return requisition;
}

export {
    getAllStockRequisitions,
    getStockRequisitionById,
    createStockRequisition,
    updateStockRequisition,
    approveStockRequisition,
    deleteStockRequisition,
    restoreStockRequisition,
};