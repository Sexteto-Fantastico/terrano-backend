import { AppDataSource } from "../infra/config/data-source";
import { Supplier } from "../infra/entities/supplier.entity";

const supplierRepository = AppDataSource.getRepository(Supplier);

async function getSupplierById(id: number): Promise<Supplier | null> {
    return await supplierRepository.findOne({ where: { id } });
}

export { getSupplierById };
