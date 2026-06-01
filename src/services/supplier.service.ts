import { Supplier, ISupplier } from "../infra/entities/supplier.entity";
import {
    SupplierResponse,
    CreateSupplierBody,
    UpdateSupplierBody,
    SupplierQuery,
    toSupplierResponse,
    toSupplierResponseList,
} from "../dtos/supplier.dto";
import * as SupplierRepository from "../repositories/supplier.repository";

async function createSupplier(data: CreateSupplierBody): Promise<SupplierResponse> {

    const entityData = {
        corporate_name: data.corporateName,
        trade_name: data.tradeName,
        cnpj: data.cnpj,
        email: data.email,
        phone: data.phone,
    } as Supplier;

    const supplier = await SupplierRepository.createSupplier(entityData);
    const loaded = await SupplierRepository.getSupplierById(supplier.id as number);
    
    return toSupplierResponse(loaded!);
}

async function getAllSuppliers(filters: SupplierQuery = {}): Promise<[SupplierResponse[], number]> {
    const [suppliers, total] = await SupplierRepository.getAllSuppliers(filters);
    return [toSupplierResponseList(suppliers), total];
}

async function getSupplierById(id: number): Promise<SupplierResponse | null> {
    const supplier = await SupplierRepository.getSupplierById(id, true);
    if (!supplier) return null;
    return toSupplierResponse(supplier);
}

async function updateSupplier(id: number, data: UpdateSupplierBody): Promise<SupplierResponse | null> {
    const supplier = await SupplierRepository.getSupplierById(id, true);
    if (!supplier) return null;

    if (data.corporateName !== undefined) supplier.corporate_name = data.corporateName;
    if (data.tradeName !== undefined) supplier.trade_name = data.tradeName;
    if (data.cnpj !== undefined) supplier.cnpj = data.cnpj;
    if (data.email !== undefined) supplier.email = data.email;
    if (data.phone !== undefined) supplier.phone = data.phone;

    await SupplierRepository.updateSupplier(supplier);

    const loaded = await SupplierRepository.getSupplierById(id, true);
    return toSupplierResponse(loaded!);
}

async function deleteSupplier(id: number): Promise<boolean> {
    const supplier = await SupplierRepository.getSupplierById(id, false);
    if (!supplier) return false;
    
    await SupplierRepository.deleteSupplier(supplier);
    return true;
}

async function restoreSupplier(id: number): Promise<SupplierResponse | null> {
    const supplier = await SupplierRepository.getSupplierById(id, true);

    if (!supplier) return null;
    if (!supplier.deleted_at) return null;

    await SupplierRepository.restoreSupplier(supplier);
    return toSupplierResponse(supplier);
}

export { 
    createSupplier, 
    getAllSuppliers, 
    getSupplierById, 
    updateSupplier, 
    deleteSupplier, 
    restoreSupplier 
};