import { AppDataSource } from "../infra/config/data-source";
import { Address } from "../infra/entities/address.entity";

const repository = AppDataSource.getRepository(Address);

async function getAllAddresses(activeOnly: boolean = false): Promise<Address[]> {
    return await repository.find({
        withDeleted: !activeOnly,
        relations: ["supplier", "stock_location"],
    });
}

async function getAddressById(id: number): Promise<Address | null> {
    return await repository.findOne({
        where: { id },
        withDeleted: true,
        relations: ["supplier", "stock_location"],
    });
}

async function saveAddress(data: Partial<Address>): Promise<Address> {
    const entity = repository.create(data);
    return await repository.save(entity);
}

async function deleteAddress(id: number): Promise<boolean> {
    const entity = await repository.findOne({ where: { id } });
    if (!entity) return false;

    await repository.softRemove(entity);
    return true;
}

async function restoreAddress(id: number): Promise<Address | null> {
    const entity = await repository.findOne({
        where: { id },
        withDeleted: true,
    });

    if (!entity || !entity.deleted_at) return null;

    await repository.recover(entity);
    return entity;
}

export {getAllAddresses, getAddressById, saveAddress, deleteAddress, restoreAddress,};