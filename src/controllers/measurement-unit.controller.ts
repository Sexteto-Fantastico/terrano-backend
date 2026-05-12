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
    CreateMeasurementUnitDto,
    UpdateMeasurementUnitDto,
    MeasurementUnitResponseDto,
    MeasurementUnitQueryDto,
} from "../dtos/measurement-unit.dto";
import { parseBooleanQuery } from "../utils/query.util";

export const getAll = async (
    req: Request<{}, MeasurementUnitResponseDto[], {}, any>,
    res: Response<MeasurementUnitResponseDto[]>
) => {
    const query: MeasurementUnitQueryDto = {
        name: req.query.name,
        activeOnly: parseBooleanQuery(req.query.activeOnly)
    };
    const { limit, offset } = req.pagination;
    const [units, total] = await getAllMeasurementUnits(query, limit, offset);
    res.setPaginationHeaders(total);
    res.json(units);
};

export const getById = async (
    req: Request<{ id: string }, MeasurementUnitResponseDto>,
    res: Response<MeasurementUnitResponseDto>
) => {
    const unit = await getMeasurementUnitById(Number(req.params.id));
    res.json(unit);
};

export const create = async (
    req: Request<CreateMeasurementUnitDto, MeasurementUnitResponseDto>,
    res: Response<MeasurementUnitResponseDto>
) => {
    const unit = await createNewMeasurementUnit(req.body);
    res.status(201).json(unit);
};

export const update = async (
    req: Request<{ id: string }, MeasurementUnitResponseDto, UpdateMeasurementUnitDto>,
    res: Response<MeasurementUnitResponseDto>
) => {
    const unit = await updateExistingMeasurementUnit(Number(req.params.id), req.body);
    res.json(unit);
};

export const remove = async (
    req: Request<{ id: string }, { message: string }>,
    res: Response<{ message: string }>
) => {
    await removeMeasurementUnit(Number(req.params.id));
    res.status(200).json({ message: "Measurement unit deleted successfully" });
};

export const restore = async (
    req: Request<{ id: string }, MeasurementUnitResponseDto>,
    res: Response<MeasurementUnitResponseDto>
) => {
    const unit = await restoreMeasurementUnit(Number(req.params.id));
    res.json(unit);
};
