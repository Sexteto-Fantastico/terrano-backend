import { AppDataSource } from "../infra/config/data-source";
import { Role } from "../infra/entities/role.entity";

const roleRepository = AppDataSource.getRepository(Role);

async function getRoleById(id: number): Promise<Role | null> {
  return await roleRepository.findOne({ where: { id } });
}

export { getRoleById };
