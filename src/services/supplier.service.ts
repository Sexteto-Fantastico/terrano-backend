import { Supplier } from "../infra/entities/supplier.entity";
import { Address } from "../infra/entities/address.entity";
import { NotFoundError, BadRequestError } from "../errors/app-error";
import {
    CreateSupplier,
    UpdateSupplier,
    SupplierResponse,
    SupplierQuery,
    toSupplierResponse,
    toSupplierResponseList,
} from "../dtos/supplier.dto";
import * as SupplierRepository from "../repositories/supplier.repository";
import * as AddressRepository from "../repositories/address.repository";

async function getAllSuppliers(
    filters: SupplierQuery = {}
): Promise<[SupplierResponse[], number]> {
    const [suppliers, total] = await SupplierRepository.getAllSuppliers(filters);
    return [toSupplierResponseList(suppliers), total];
}

async function getSupplierById(
    id: number
): Promise<SupplierResponse> {
    const entity = await SupplierRepository.getSupplierById(id, true);

    if (!entity) {
        throw new NotFoundError("Supplier not found");
    }

    return toSupplierResponse(entity);
}

async function createSupplier(
    data: CreateSupplier
): Promise<SupplierResponse> {
    const { address, ...supplierData } = data;

    const emailExists = await SupplierRepository.getSupplierByEmail(supplierData.email);
    if (emailExists) {
        throw new BadRequestError("Já existe um fornecedor cadastrado com este e-mail.");
    }

    const cnpjExists = await SupplierRepository.getSupplierByCnpj(supplierData.cnpj);
    if (cnpjExists) {
        throw new BadRequestError("Já existe um fornecedor cadastrado com este CNPJ.");
    }

    const supplier = new Supplier({
        corporate_name: supplierData.corporateName,
        trade_name: supplierData.tradeName,
        cnpj: supplierData.cnpj,
        email: supplierData.email,
        phone: supplierData.phone,
    });

    const savedSupplier = await SupplierRepository.createSupplier(supplier);

    if (address) {
        await AddressRepository.saveAddress(new Address({
            street: address.street,
            number: address.number,
            neighborhood: address.neighborhood,
            city: address.city,
            state: address.state,
            country: address.country,
            complement: address.complement,
            supplier: savedSupplier
        }));
    }

    const loaded = await SupplierRepository.getSupplierById(
        savedSupplier.id as number,
        true
    );

    return toSupplierResponse(loaded!);
}

async function updateSupplier(
    id: number,
    data: UpdateSupplier
): Promise<SupplierResponse> {
    const existing = await SupplierRepository.getSupplierById(id, true);

    if (!existing) {
        throw new NotFoundError("Supplier not found");
    }

    const { address, corporateName, tradeName, cnpj, email, phone } = data;

    if (email && email !== existing.email) {
        const emailExists = await SupplierRepository.getSupplierByEmail(email);
        if (emailExists) {
            throw new BadRequestError("Este e-mail já está em uso por outro fornecedor.");
        }
    }

    if (cnpj && cnpj !== existing.cnpj) {
        const cnpjExists = await SupplierRepository.getSupplierByCnpj(cnpj);
        if (cnpjExists) {
            throw new BadRequestError("Este CNPJ já está em uso por outro fornecedor.");
        }
    }

    const updateData = {
        ...(corporateName !== undefined && { corporate_name: corporateName }),
        ...(tradeName !== undefined && { trade_name: tradeName }),
        ...(cnpj !== undefined && { cnpj }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone }),
    };

    Object.assign(existing, updateData);
    
    const savedSupplier = await SupplierRepository.updateSupplier(existing);

    if (address) {
        if (!existing.address) {
            await AddressRepository.saveAddress(new Address({
                street: address.street ?? "",
                number: address.number ?? "",
                neighborhood: address.neighborhood ?? "",
                city: address.city ?? "",
                state: address.state ?? "",
                country: address.country ?? "",
                complement: address.complement,
                supplier: savedSupplier
            }));
        } else {
            Object.assign(existing.address, address);
            await AddressRepository.saveAddress(existing.address);
        }
    }

    const loaded = await SupplierRepository.getSupplierById(id, true);

    return toSupplierResponse(loaded!);
}

async function deleteSupplier(
    id: number
): Promise<boolean> {
    const existing = await SupplierRepository.getSupplierById(id, false);

    if (!existing) {
        throw new NotFoundError("Supplier not found");
    }

    await SupplierRepository.deleteSupplier(existing);

    return true;
}

async function restoreSupplier(
    id: number
): Promise<SupplierResponse> {
    const existing = await SupplierRepository.getSupplierById(id, true);

    if (!existing || !existing.deleted_at) {
        throw new NotFoundError("Supplier not found or not deleted");
    }

    await SupplierRepository.restoreSupplier(existing);

    return toSupplierResponse(existing);
}

export {
    getAllSuppliers,
    getSupplierById,
    createSupplier,
    updateSupplier,
    deleteSupplier,
    restoreSupplier,
};