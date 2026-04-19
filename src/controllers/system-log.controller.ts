
import { Request, Response } from "express";
import { SystemLogService } from "../services/system-log.service";

const service = new SystemLogService();

export class SystemLogController {

    async getLogs(req: Request, res: Response) {
        const { entity, entityId } = req.query;

        const logs = await service.getLogs(
            entity as string,
            entityId ? Number(entityId) : undefined
        );

        return res.json(logs);
    }
}