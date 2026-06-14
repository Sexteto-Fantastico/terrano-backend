import { AppDataSource } from "../config/data-source";
import { Policy } from "../entities/policy.entity";

export async function createPolicySeed(): Promise<void> {
    const repository = AppDataSource.getRepository(Policy);

    const policies = [
        // ── REGISTERS ─────────────────────────────────────────────────────────
        { name: "PRODUCT_CREATE",          description: "Criar produtos",                    resource: "PRODUCT",                      module: "REGISTERS",    action: "CREATE" },
        { name: "PRODUCT_READ",            description: "Visualizar produtos",               resource: "PRODUCT",                      module: "REGISTERS",    action: "READ"   },
        { name: "PRODUCT_UPDATE",          description: "Editar produtos",                   resource: "PRODUCT",                      module: "REGISTERS",    action: "UPDATE" },
        { name: "PRODUCT_DELETE",          description: "Excluir produtos",                  resource: "PRODUCT",                      module: "REGISTERS",    action: "DELETE" },

        { name: "PRODUCT_BRAND_CREATE",    description: "Criar marcas de produto",           resource: "PRODUCT_BRAND",                module: "REGISTERS",    action: "CREATE" },
        { name: "PRODUCT_BRAND_READ",      description: "Visualizar marcas de produto",      resource: "PRODUCT_BRAND",                module: "REGISTERS",    action: "READ"   },
        { name: "PRODUCT_BRAND_UPDATE",    description: "Editar marcas de produto",          resource: "PRODUCT_BRAND",                module: "REGISTERS",    action: "UPDATE" },
        { name: "PRODUCT_BRAND_DELETE",    description: "Excluir marcas de produto",         resource: "PRODUCT_BRAND",                module: "REGISTERS",    action: "DELETE" },

        { name: "PRODUCT_CATEGORY_CREATE", description: "Criar categorias de produto",       resource: "PRODUCT_CATEGORY",             module: "REGISTERS",    action: "CREATE" },
        { name: "PRODUCT_CATEGORY_READ",   description: "Visualizar categorias de produto",  resource: "PRODUCT_CATEGORY",             module: "REGISTERS",    action: "READ"   },
        { name: "PRODUCT_CATEGORY_UPDATE", description: "Editar categorias de produto",      resource: "PRODUCT_CATEGORY",             module: "REGISTERS",    action: "UPDATE" },
        { name: "PRODUCT_CATEGORY_DELETE", description: "Excluir categorias de produto",     resource: "PRODUCT_CATEGORY",             module: "REGISTERS",    action: "DELETE" },

        { name: "STOCK_LOCATION_CREATE",   description: "Criar locais de estoque",           resource: "STOCK_LOCATION",               module: "REGISTERS",    action: "CREATE" },
        { name: "STOCK_LOCATION_READ",     description: "Visualizar locais de estoque",      resource: "STOCK_LOCATION",               module: "REGISTERS",    action: "READ"   },
        { name: "STOCK_LOCATION_UPDATE",   description: "Editar locais de estoque",          resource: "STOCK_LOCATION",               module: "REGISTERS",    action: "UPDATE" },
        { name: "STOCK_LOCATION_DELETE",   description: "Excluir locais de estoque",         resource: "STOCK_LOCATION",               module: "REGISTERS",    action: "DELETE" },

        { name: "SUPPLIER_CREATE",         description: "Criar fornecedores",                resource: "SUPPLIER",                     module: "REGISTERS",    action: "CREATE" },
        { name: "SUPPLIER_READ",           description: "Visualizar fornecedores",           resource: "SUPPLIER",                     module: "REGISTERS",    action: "READ"   },
        { name: "SUPPLIER_UPDATE",         description: "Editar fornecedores",               resource: "SUPPLIER",                     module: "REGISTERS",    action: "UPDATE" },
        { name: "SUPPLIER_DELETE",         description: "Excluir fornecedores",              resource: "SUPPLIER",                     module: "REGISTERS",    action: "DELETE" },

        { name: "DEPARTMENT_CREATE",       description: "Criar departamentos",               resource: "DEPARTMENT",                   module: "REGISTERS",    action: "CREATE" },
        { name: "DEPARTMENT_READ",         description: "Visualizar departamentos",          resource: "DEPARTMENT",                   module: "REGISTERS",    action: "READ"   },
        { name: "DEPARTMENT_UPDATE",       description: "Editar departamentos",              resource: "DEPARTMENT",                   module: "REGISTERS",    action: "UPDATE" },
        { name: "DEPARTMENT_DELETE",       description: "Excluir departamentos",             resource: "DEPARTMENT",                   module: "REGISTERS",    action: "DELETE" },

        { name: "MEASUREMENT_UNIT_CREATE", description: "Criar unidades de medida",          resource: "MEASUREMENT_UNIT",             module: "REGISTERS",    action: "CREATE" },
        { name: "MEASUREMENT_UNIT_READ",   description: "Visualizar unidades de medida",     resource: "MEASUREMENT_UNIT",             module: "REGISTERS",    action: "READ"   },
        { name: "MEASUREMENT_UNIT_UPDATE", description: "Editar unidades de medida",         resource: "MEASUREMENT_UNIT",             module: "REGISTERS",    action: "UPDATE" },
        { name: "MEASUREMENT_UNIT_DELETE", description: "Excluir unidades de medida",        resource: "MEASUREMENT_UNIT",             module: "REGISTERS",    action: "DELETE" },

        // ── REQUESTS ──────────────────────────────────────────────────────────
        { name: "MATERIAL_REQUESTER_CREATE",           description: "Criar solicitações de material",              resource: "MATERIAL_REQUESTER",           module: "REQUESTS", action: "CREATE" },
        { name: "MATERIAL_REQUESTER_READ",             description: "Visualizar solicitações de material",         resource: "MATERIAL_REQUESTER",           module: "REQUESTS", action: "READ"   },
        { name: "MATERIAL_REQUESTER_UPDATE",           description: "Editar solicitações de material",             resource: "MATERIAL_REQUESTER",           module: "REQUESTS", action: "UPDATE" },
        { name: "MATERIAL_REQUESTER_DELETE",           description: "Excluir solicitações de material",            resource: "MATERIAL_REQUESTER",           module: "REQUESTS", action: "DELETE" },

        { name: "MATERIAL_REQUESTS_MANAGEMENT_CREATE", description: "Criar solicitações de material como gestor",   resource: "MATERIAL_REQUESTS_MANAGEMENT", module: "REQUESTS", action: "CREATE" },
        { name: "MATERIAL_REQUESTS_MANAGEMENT_READ",   description: "Visualizar solicitações de material como gestor", resource: "MATERIAL_REQUESTS_MANAGEMENT", module: "REQUESTS", action: "READ" },
        { name: "MATERIAL_REQUESTS_MANAGEMENT_UPDATE", description: "Editar solicitações de material como gestor",  resource: "MATERIAL_REQUESTS_MANAGEMENT", module: "REQUESTS", action: "UPDATE" },
        { name: "MATERIAL_REQUESTS_MANAGEMENT_DELETE", description: "Excluir solicitações de material como gestor", resource: "MATERIAL_REQUESTS_MANAGEMENT", module: "REQUESTS", action: "DELETE" },

        // ── TRANSACTIONS ──────────────────────────────────────────────────────
        { name: "PURCHASE_CREATE",       description: "Criar compras",               resource: "PURCHASE",       module: "TRANSACTIONS", action: "CREATE" },
        { name: "PURCHASE_READ",         description: "Visualizar compras",          resource: "PURCHASE",       module: "TRANSACTIONS", action: "READ"   },
        { name: "PURCHASE_UPDATE",       description: "Editar compras",              resource: "PURCHASE",       module: "TRANSACTIONS", action: "UPDATE" },
        { name: "PURCHASE_DELETE",       description: "Excluir compras",             resource: "PURCHASE",       module: "TRANSACTIONS", action: "DELETE" },

        { name: "MOVEMENT_ENTRY_CREATE", description: "Criar entradas de movimento", resource: "MOVEMENT_ENTRY", module: "TRANSACTIONS", action: "CREATE" },
        { name: "MOVEMENT_ENTRY_READ",   description: "Visualizar entradas de movimento", resource: "MOVEMENT_ENTRY", module: "TRANSACTIONS", action: "READ" },
        { name: "MOVEMENT_ENTRY_UPDATE", description: "Editar entradas de movimento", resource: "MOVEMENT_ENTRY", module: "TRANSACTIONS", action: "UPDATE" },
        { name: "MOVEMENT_ENTRY_DELETE", description: "Excluir entradas de movimento", resource: "MOVEMENT_ENTRY", module: "TRANSACTIONS", action: "DELETE" },

        { name: "MOVEMENT_EXIT_CREATE",  description: "Criar saídas de movimento",   resource: "MOVEMENT_EXIT",  module: "TRANSACTIONS", action: "CREATE" },
        { name: "MOVEMENT_EXIT_READ",    description: "Visualizar saídas de movimento", resource: "MOVEMENT_EXIT", module: "TRANSACTIONS", action: "READ"  },
        { name: "MOVEMENT_EXIT_UPDATE",  description: "Editar saídas de movimento",   resource: "MOVEMENT_EXIT",  module: "TRANSACTIONS", action: "UPDATE" },
        { name: "MOVEMENT_EXIT_DELETE",  description: "Excluir saídas de movimento",  resource: "MOVEMENT_EXIT",  module: "TRANSACTIONS", action: "DELETE" },

        // ── REPORTS ───────────────────────────────────────────────────────────
        { name: "DASHBOARD_READ",       description: "Visualizar dashboard",               resource: "DASHBOARD",      module: "REPORTS",  action: "READ" },
        { name: "STOCK_POSITION_READ",  description: "Visualizar posição de estoque",      resource: "STOCK_POSITION", module: "REPORTS", action: "READ" },
        { name: "PRODUCT_TRACE_READ",   description: "Visualizar rastreamento de produto", resource: "PRODUCT_TRACE",   module: "REPORTS", action: "READ" },

        // ── ACCESS CONTROL ────────────────────────────────────────────────────
        { name: "USER_CREATE",          description: "Criar usuários",               resource: "USER",           module: "ACCESS_CONTROL", action: "CREATE" },
        { name: "USER_READ",            description: "Visualizar usuários",          resource: "USER",           module: "ACCESS_CONTROL", action: "READ"   },
        { name: "USER_UPDATE",          description: "Editar usuários",              resource: "USER",           module: "ACCESS_CONTROL", action: "UPDATE" },
        { name: "USER_DELETE",          description: "Excluir usuários",             resource: "USER",           module: "ACCESS_CONTROL", action: "DELETE" },

        // ── NOTIFICATIONS ─────────────────────────────────────────────────────
        { name: "ALERT_CREATE",         description: "Criar alertas",                resource: "ALERT",          module: "NOTIFICATIONS",  action: "CREATE" },
        { name: "ALERT_READ",           description: "Visualizar alertas",           resource: "ALERT",          module: "NOTIFICATIONS",  action: "READ"   },
        { name: "ALERT_UPDATE",         description: "Editar alertas",               resource: "ALERT",          module: "NOTIFICATIONS",  action: "UPDATE" },
        { name: "ALERT_DELETE",         description: "Excluir alertas",              resource: "ALERT",          module: "NOTIFICATIONS",  action: "DELETE" },

        // ── LOGS ───────────────────────────────────────────────────────────
        { name: "TABLE_LOGS_READ",  description: "Visualizar logs de tabelas",  resource: "TABLE_LOGS", module: "LOGS", action: "READ" },
    ];

    for (const policyData of policies) {
        const exists = await repository.findOne({
            where: {
                name: policyData.name,
                module: policyData.module,
            },
        });

        if (exists) {
            continue;
        }

        const policy = repository.create(policyData);
        await repository.save(policy);
    }

    console.log("Policy seed completed");
}