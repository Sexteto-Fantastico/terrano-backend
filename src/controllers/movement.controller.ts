import { Request, Response } from "express";
import * as MovementService from "../services/movement.service";
import { toMovementExitResponseDto } from "../dtos/movement.dto";

async function createMovementExit(req: Request, res: Response) {
    const created = await MovementService.createMovementExit(req.body);
    res.status(201).json(toMovementExitResponseDto(created));
}

export { createMovementExit };
