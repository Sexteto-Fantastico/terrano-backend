import { Request, Response } from "express";
import * as MaterialRequestService from "../services/material-request.service";

export async function createMaterialRequest(req: Request, res: Response) {
    const materialRequest =
        await MaterialRequestService.createMaterialRequest(req.body);

    res.status(201).json(materialRequest);
}

export async function getMaterialRequests(req: Request, res: Response) {
    const materialRequests =
        await MaterialRequestService.getMaterialRequests();

    res.json(materialRequests);
}

export async function getMaterialRequestById(req: Request, res: Response) {
    const id = Number(req.params.id);

    const materialRequest =
        await MaterialRequestService.getMaterialRequestById(id);

    res.json(materialRequest);
}

export async function updateMaterialRequest(req: Request, res: Response) {
    const id = Number(req.params.id);

    const materialRequest =
        await MaterialRequestService.updateMaterialRequest(id, req.body);

    res.json(materialRequest);
}

export async function deleteMaterialRequest(req: Request, res: Response) {
    const id = Number(req.params.id);

    await MaterialRequestService.deleteMaterialRequest(id);

    res.status(204).send();
}