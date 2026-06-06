export const HttpMethod = {
    GET: "get",
    POST: "post",
    PUT: "put",
    DELETE: "delete",
    PATCH: "patch",
} as const;

export type HttpMethod = typeof HttpMethod[keyof typeof HttpMethod];

export const ContentType = {
    JSON: "application/json"
} as const;

export type ContentType = typeof ContentType[keyof typeof ContentType];

const CRUD_ROUTES = {
    CREATE: "/",
    GET_ALL: "/",
    GET_BY_ID: "/:id",
    UPDATE: "/:id",
    DELETE: "/:id",
    GET_LOGS: "/:id/logs",
    RESTORE: "/:id/restore",
} as const;

export const API_PREFIX = "/api" as const;

export const Endpoints = {
    AUTH: {
        BASE: `${API_PREFIX}/auth`,
        LOGIN: "/login",
        FORGOT_PASSWORD: "/forgot-password",
        RESET_PASSWORD: "/reset-password",
        DEFINE_PASSWORD: "/define-password",
        ME: "/me",
    },
    USERS: {
        BASE: `${API_PREFIX}/users`,
        ...CRUD_ROUTES,
        CHANGE_PASSWORD: "/:id/password",
    },

    PRODUCT_CATEGORIES: {
        BASE: `${API_PREFIX}/product-categories`,
        ...CRUD_ROUTES,
    },
    SUPPLIERS: {
        BASE: `${API_PREFIX}/suppliers`,
        ...CRUD_ROUTES,
    },
    PRODUCTS: {
        BASE: `${API_PREFIX}/products`,
        ...CRUD_ROUTES,
    },

    PRODUCT_BRANDS: {
        BASE: `${API_PREFIX}/product-brands`,
        ...CRUD_ROUTES,
    },

    DEPARTMENTS: {
        BASE: `${API_PREFIX}/departments`,
        ...CRUD_ROUTES,
    },

    STOCK_LOCATIONS: {
        BASE: `${API_PREFIX}/stock-locations`,
        ...CRUD_ROUTES,
    },

    MEASUREMENT_UNITS: {
        BASE: `${API_PREFIX}/measurement-units`,
        ...CRUD_ROUTES,
    },

    PURCHASES: {
        BASE: `${API_PREFIX}/purchases`,
        ...CRUD_ROUTES,
        RECEIVE: "/:id/receive",
    },

    MOVEMENTS: {
        BASE: `${API_PREFIX}/movements`,
        EXIT: "/exit",
        ENTRY: "/entry",
        ENTRY_GET_BY_ID: "/entry/:id",
    },

    HOME: {
        BASE: `${API_PREFIX}/home`,
        SUMMARY: "/summary",
    },

    STOCK_REQUISITIONS: {
        BASE: `${API_PREFIX}/stock-requisitions`,
        ...CRUD_ROUTES,
    },

    STOCK_POSITIONINGS: {
        BASE: `${API_PREFIX}/stock-positionings`,
        GET_ALL: "/",
        METRICS: "/metrics",
        EXPORT: "/export",
    },
} as const;