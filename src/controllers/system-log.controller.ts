import { Request, Response } from "express";
import * as SystemLogService from "../services/system-log.service";

export async function getUserLogs(
    req: Request,
    res: Response
) {
    const id = Number(req.params.id);

    const logs = await SystemLogService.getEntityLogs(
        "user",
        id
    );

    return res.status(200).json(logs);
}

export async function getProductLogs(
    req: Request,
    res: Response
) {
    const id = Number(req.params.id);

    const logs = await SystemLogService.getEntityLogs(
        "product",
        id
    );

    return res.status(200).json(logs);
}

export async function getStockLocationLogs(
    req: Request,
    res: Response
) {
    const id = Number(req.params.id);

    const logs = await SystemLogService.getEntityLogs(
        "stock_location",
        id
    );

    return res.status(200).json(logs);
}

export async function getDepartmentLogs(
    req: Request,
    res: Response
) {
    const id = Number(req.params.id);

    const logs = await SystemLogService.getEntityLogs(
        "department",
        id
    );

    return res.status(200).json(logs);
}

export async function getProductBrandLogs(
    req: Request,
    res: Response
) {
    const id = Number(req.params.id);

    const logs = await SystemLogService.getEntityLogs(
        "product_brand",
        id
    );

    return res.status(200).json(logs);
}

export async function getProductCategoryLogs(
    req: Request,
    res: Response
) {
    const id = Number(req.params.id);

    const logs = await SystemLogService.getEntityLogs(
        "product_category",
        id
    );

    return res.status(200).json(logs);
}

export async function getMeasurementUnitLogs(
    req: Request,
    res: Response
) {
    const id = Number(req.params.id);

    const logs = await SystemLogService.getEntityLogs(
        "measurement_unit",
        id
    );

    return res.status(200).json(logs);
}