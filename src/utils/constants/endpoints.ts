const CRUD_ROUTES = {
    CREATE: "/",
    GET_ALL: "/",
    GET_BY_ID: "/:id",
    UPDATE: "/:id",
    DELETE: "/:id",
} as const;

export const API_PREFIX = "/api" as const;

export const Endpoints = {
    USERS: {
        BASE: `${API_PREFIX}/users`,
        ...CRUD_ROUTES,
        CHANGE_PASSWORD: "/:id/password",
    },

    PRODUCT_CATEGORIES: {
        BASE: `${API_PREFIX}/product-categories`,
        ...CRUD_ROUTES,
        RESTORE: "/:id/restore",
    },

    PRODUCTS: {
        BASE: `${API_PREFIX}/products`,
        ...CRUD_ROUTES,
    },

    PRODUCT_BRANDS: {
        BASE: `${API_PREFIX}/product-brands`,
        ...CRUD_ROUTES,
        RESTORE: "/:id/restore",
    },

    DEPARTMENTS: {
        BASE: `${API_PREFIX}/departments`,
        ...CRUD_ROUTES,
        RESTORE: "/:id/restore",
    },

    STOCK_LOCATIONS: {
        BASE: `${API_PREFIX}/stock-locations`,
        ...CRUD_ROUTES,
        RESTORE: "/:id/restore",
    },
    LOGS: {
        BASE: "/logs",
        GET: "/"
    }
} as const;