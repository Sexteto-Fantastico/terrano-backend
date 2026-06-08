import { Request, Response } from "express";
import * as MovementService from "../services/movement.service";
import {
    toMovementExitResponse,
    toMovementEntryResponse,
    MovementExitQuery,
    MovementExitResponse
} from "../dtos/movement.dto";

async function createMovementExit(req: Request, res: Response) {
    const created = await MovementService.createMovementExit(req.body);
    res.status(201).json(toMovementExitResponse(created));
}

async function getMovementExits(req: Request<{}, MovementExitResponse[], {}, MovementExitQuery>, res: Response<MovementExitResponse[]>) {
    const [exits, total] = await MovementService.listMovementExits(req.query);
    res.set("X-Total-Count", total.toString());
    res.status(200).json(exits.map(toMovementExitResponse));
}

async function getMovementExitById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const exits = await MovementService.findMovementExit(id);
    res.status(200).json(toMovementExitResponse(exits));
}

async function createMovementEntry(req: Request, res: Response) {
    const created = await MovementService.createMovementEntry(req.body);
    res.status(201).json(toMovementEntryResponse(created));
}

async function getMovementEntries(req: Request, res: Response) {
    const entries = await MovementService.listMovementEntries();
    res.status(200).json(entries.map(toMovementEntryResponse));
}

async function getMovementEntryById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const entry = await MovementService.findMovementEntry(id);
    res.status(200).json(toMovementEntryResponse(entry));
}

async function deleteMovementExit(req: Request, res: Response) {
    const id = Number(req.params.id);
    await MovementService.deleteMovementExit(id);
    res.status(204).send();
}

export {
    createMovementExit,
    createMovementEntry,
    getMovementEntries,
    getMovementEntryById,
    getMovementExits,
    getMovementExitById,
    deleteMovementExit
};