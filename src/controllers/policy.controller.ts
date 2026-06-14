import { NextFunction, Request, Response } from "express";
import * as policyService from "../services/policy.service";

async function getAllPolicies(req: Request, res: Response, next: NextFunction): Promise<void> {
    const policies = await policyService.getAllPolicies();
    res.status(200).json(policies);
}

export { getAllPolicies };
