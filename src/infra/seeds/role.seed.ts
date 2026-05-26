import { AppDataSource } from "../config/data-source";
import { Role } from "../entities/role.entity";

export async function createRoleSeed(): Promise<void> {
  const roleRepository = AppDataSource.getRepository(Role);

  const roles = [
    {
      name: "ADMIN",
      description: "System administrator",
    },
    {
      name: "READER",
      description: "Read-only access",
    },
  ];

  for (const roleData of roles) {
    const existingRole = await roleRepository.findOne({
      where: {
        name: roleData.name,
      },
    });

    if (existingRole) {
      console.log(`Role ${roleData.name} already exists`);
      continue;
    }

    const role = new Role({
      ...roleData,
      policies: [],
    });

    const savedRole = await roleRepository.save(role);

    console.log(
      `Role created successfully -> ID: ${savedRole.id} | Name: ${savedRole.name}`
    );
  }

  console.log("Role seed completed successfully");
}
