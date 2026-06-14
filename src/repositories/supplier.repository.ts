import { FindOptionsWhere, FindManyOptions, ILike } from "typeorm";
import { AppDataSource } from "../infra/config/data-source";
import { Supplier } from "../infra/entities/supplier.entity";
import { SupplierQuery } from "../dtos/supplier.dto";

const supplierRepository = AppDataSource.getRepository(Supplier);

async function createSupplier(data: Supplier): Promise<Supplier> {
    const supplier = supplierRepository.create(data);
    return await supplierRepository.save(supplier);
}

async function getAllSuppliers(filters: SupplierQuery = {} as SupplierQuery): Promise<[Supplier[], number]> {
    const { 
        corporateName, 
        tradeName, 
        cnpj, 
        activeOnly = true, 
        pageIndex, 
        pageSize, 
        sortBy, 
        sortOrder 
    } = filters;

    const where: FindOptionsWhere<Supplier> = {};

    if (corporateName) where.corporate_name = ILike(`%${corporateName}%`);
    if (tradeName) where.trade_name = ILike(`%${tradeName}%`);
    if (cnpj) where.cnpj = ILike(`%${cnpj}%`);

    const options: FindManyOptions<Supplier> = {
        where,
        withDeleted: !activeOnly,
        relations: ["address"],
    };

    if (sortBy) {
        options.order = { [sortBy]: sortOrder ?? "ASC" };
    }

    if (pageIndex !== undefined && pageSize !== undefined) {
        options.take = pageSize;
        options.skip = (pageIndex - 1) * pageSize;
        return await supplierRepository.findAndCount(options);
    }

    const results = await supplierRepository.find(options);
    return [results, results.length];
}

async function getSupplierById(id: number, withDeleted: boolean = false): Promise<Supplier | null> {
    return await supplierRepository.findOne({
        where: { id },
        withDeleted,
        relations: ["address"],
    });
}

async function getSupplierByEmail(email: string): Promise<Supplier | null> {
    return await supplierRepository.findOne({
        where: { email },
        withDeleted: true,
    });
}

async function getSupplierByCnpj(cnpj: string): Promise<Supplier | null> {
    return await supplierRepository.findOne({
        where: { cnpj },
        withDeleted: true,
    });
}

async function updateSupplier(supplier: Supplier): Promise<Supplier> {
    return await supplierRepository.save(supplier);
}

async function deleteSupplier(supplier: Supplier): Promise<boolean> {
    const result = await supplierRepository.softRemove(supplier);
    return !!result;
}

async function restoreSupplier(supplier: Supplier): Promise<Supplier> {
    return await supplierRepository.recover(supplier);
}

export { 
    createSupplier, 
    getAllSuppliers, 
    getSupplierById, 
    getSupplierByEmail,
    getSupplierByCnpj, 
    updateSupplier, 
    deleteSupplier, 
    restoreSupplier 
};