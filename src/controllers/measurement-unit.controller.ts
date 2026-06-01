import { Request, Response } from "express";
import {
    getAllMeasurementUnits,
    getMeasurementUnitById,
    createNewMeasurementUnit,
    updateExistingMeasurementUnit,
    removeMeasurementUnit,
    restoreMeasurementUnit,
} from "../services/measurement-unit.service";
import {
    CreateMeasurementUnit,
    UpdateMeasurementUnit,
    MeasurementUnitResponse,
    MeasurementUnitQuery,
} from "../dtos/measurement-unit.dto";

export const getAll = async (
    req: Request<{}, MeasurementUnitResponse[], {}, MeasurementUnitQuery>,
    res: Response<MeasurementUnitResponse[]>
) => {
    const [units, total] = await getAllMeasurementUnits(req.query);
    res.set("X-Total-Count", total.toString());
    res.json(units);
};

export const getById = async (
    req: Request<{ id: string }, MeasurementUnitResponse>,
    res: Response<MeasurementUnitResponse>
) => {
    const unit = await getMeasurementUnitById(Number(req.params.id));
    res.json(unit);
};

export const create = async (
    req: Request<CreateMeasurementUnit, MeasurementUnitResponse>,
    res: Response<MeasurementUnitResponse>
) => {
    const unit = await createNewMeasurementUnit(req.body);
    res.status(201).json(unit);
};

export const update = async (
    req: Request<{ id: string }, MeasurementUnitResponse, UpdateMeasurementUnit>,
    res: Response<MeasurementUnitResponse>
) => {
    const unit = await updateExistingMeasurementUnit(Number(req.params.id), req.body);
    res.json(unit);
};

export const remove = async (
    req: Request<{ id: string }>,
    res: Response
) => {
    await removeMeasurementUnit(Number(req.params.id));
    res.status(204).send();
};

export const restore = async (
    req: Request<{ id: string }, MeasurementUnitResponse>,
    res: Response<MeasurementUnitResponse>
) => {
    const unit = await restoreMeasurementUnit(Number(req.params.id));
    res.json(unit);
};
