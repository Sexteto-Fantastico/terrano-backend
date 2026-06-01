import { Request, Response } from "express";
import * as HomeService from "../services/home.service";

async function getHomeSummary(req: Request, res: Response): Promise<void> {
    const summary = await HomeService.getHomeSummary();
    res.status(200).json(summary);
}

export { getHomeSummary };
