/**
 * Standard CRUD sub-routes reused across every resource.
 * Kept DRY so adding a new resource only requires a BASE path.
 */
const CRUD_ROUTES = {
    CREATE: "/",
    GET_ALL: "/",
    GET_BY_ID: "/:id",
    UPDATE: "/:id",
    DELETE: "/:id",
} as const;

/**
 * Centralised endpoint registry.
 *
 * • Every resource lives under a common `/api` prefix defined once.
 * • CRUD routes are spread from CRUD_ROUTES; resource-specific routes
 *   are declared inline.
 * • `as const` gives full literal-type safety to every path string.
 */
export const API_PREFIX = "/api" as const;

export const Endpoints = {
    AUTH: {
        BASE: `${API_PREFIX}/auth`,
        LOGIN: "/login",
        FORGOT_PASSWORD: "/forgot-password",
        RESET_PASSWORD: "/reset-password",
        DEFINE_PASSWORD: "/define-password",
    },
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
} as const;
