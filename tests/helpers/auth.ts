jest.mock("../../src/middlewares/auth.middleware", () => ({
    authMiddleware: (
        req: any,
        res: any,
        next: any
    ) => {
        req.user = {
            id: 1
        };

        next();
    }
}));