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

export const getAll = async (
  req: Request<{}, MeasurementUnitResponseDto[], {}, MeasurementUnitQueryDto>,
  res: Response<MeasurementUnitResponseDto[]>
) => {
  const [units, total] = await getAllMeasurementUnits(req.query);
  res.set("X-Total-Count", total.toString());
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
  req: Request<
    { id: string },
    MeasurementUnitResponseDto,
    UpdateMeasurementUnitDto
  >,
  res: Response<MeasurementUnitResponseDto>
) => {
  const unit = await updateExistingMeasurementUnit(
    Number(req.params.id),
    req.body
  );
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
