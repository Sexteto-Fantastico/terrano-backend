import { Request, Response } from "express";
import * as MovementService from "../services/movement.service";
import { 
    toMovementExitResponse, 
    toMovementEntryResponse 
} from "../dtos/movement.dto";

async function createMovementExit(req: Request, res: Response) {
    const created = await MovementService.createMovementExit(req.body);
    res.status(201).json(toMovementExitResponse(created));
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

export { 
    createMovementExit,
    createMovementEntry,
    getMovementEntries,
    getMovementEntryById
};