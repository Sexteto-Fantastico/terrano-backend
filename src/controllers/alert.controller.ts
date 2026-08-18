import { Request, Response } from "express";
import * as AlertService from "../services/alert.service";
import { NotFoundError } from "../errors";
import {
    CreateAlertBody,
    UpdateAlertBody,
    AlertResponse,
    AlertQuery,
} from "../dtos/alert.dto";

async function createAlert(req: Request<unknown, AlertResponse, CreateAlertBody>, res: Response<AlertResponse>) {
    const alert = await AlertService.createAlert(req.body);
    res.status(201).json(alert);
}

async function getAllAlerts(req: Request<unknown, AlertResponse[], unknown, AlertQuery>, res: Response<AlertResponse[]>) {
    const [alerts, total] = await AlertService.getAllAlerts(req.query);
    res.set("X-Total-Count", total.toString());
    res.status(200).json(alerts);
}

async function getAlertById(req: Request<{ id: string }, AlertResponse>, res: Response<AlertResponse>) {
    const id = Number(req.params.id);
    const alert = await AlertService.getAlertById(id);

    if (!alert) {
        throw new NotFoundError("Alert not found");
    }

    res.status(200).json(alert);
}

async function updateAlert(req: Request<{ id: string }, AlertResponse, UpdateAlertBody>, res: Response<AlertResponse>) {
    const id = Number(req.params.id);
    const alert = await AlertService.updateAlert(id, req.body);

    if (!alert) {
        throw new NotFoundError("Alert not found");
    }

    res.status(200).json(alert);
}

async function deleteAlert(req: Request<{ id: string }>, res: Response) {
    const id = Number(req.params.id);
    const success = await AlertService.deleteAlert(id);

    if (!success) {
        throw new NotFoundError("Alert not found");
    }

    res.status(204).send();
}

async function restoreAlert(req: Request<{ id: string }, AlertResponse>, res: Response<AlertResponse>) {
    const id = Number(req.params.id);
    const alert = await AlertService.restoreAlert(id);

    if (!alert) {
        throw new NotFoundError("Alert not found or not deleted");
    }

    res.status(200).json(alert);
}

async function checkLowStockAlerts(req: Request, res: Response) {
    await AlertService.checkLowStockAlerts();
    res.status(200).json({ succeeded: true });
}

export { createAlert, getAllAlerts, getAlertById, updateAlert, deleteAlert, restoreAlert, checkLowStockAlerts };
