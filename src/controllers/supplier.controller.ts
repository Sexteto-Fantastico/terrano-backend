import { Request, Response } from "express";
import * as SupplierService from "../services/supplier.service";
import { NotFoundError } from "../errors";
import {
    CreateSupplier,
    UpdateSupplier,
    SupplierResponse,
    SupplierQuery,
} from "../dtos/supplier.dto";

async function getAllSuppliers(
    req: Request<{}, SupplierResponse[], {}, SupplierQuery>,
    res: Response<SupplierResponse[]>
) {
    const [data, total] = await SupplierService.getAllSuppliers(req.query);
    res.set("X-Total-Count", total.toString());
    res.status(200).json(data);
}

async function getSupplierById(
    req: Request<{ id: string }, SupplierResponse>,
    res: Response<SupplierResponse>
) {
    const id = Number(req.params.id);
    const data = await SupplierService.getSupplierById(id);
    
    if (!data) {
        throw new NotFoundError("Supplier not found");
    }
    
    res.status(200).json(data);
}

async function createSupplier(
    req: Request<{}, SupplierResponse, CreateSupplier>,
    res: Response<SupplierResponse>
) {
    const data = await SupplierService.createSupplier(req.body);
    res.status(201).json(data);
}

async function updateSupplier(
    req: Request<{ id: string }, SupplierResponse, UpdateSupplier>,
    res: Response<SupplierResponse>
) {
    const id = Number(req.params.id);
    const data = await SupplierService.updateSupplier(id, req.body);
    
    if (!data) {
        throw new NotFoundError("Supplier not found");
    }
    
    res.status(200).json(data);
}

async function deleteSupplier(
    req: Request<{ id: string }>,
    res: Response
) {
    const id = Number(req.params.id);
    const success = await SupplierService.deleteSupplier(id);
    
    if (!success) {
        throw new NotFoundError("Supplier not found");
    }
    
    res.status(204).send();
}

async function restoreSupplier(
    req: Request<{ id: string }, SupplierResponse>,
    res: Response<SupplierResponse>
) {
    const id = Number(req.params.id);
    const data = await SupplierService.restoreSupplier(id);
    
    if (!data) {
        throw new NotFoundError("Supplier not found or not deleted");
    }
    
    res.status(200).json(data);
}

export {
    getAllSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    restoreSupplier
};