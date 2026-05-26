import { Entity, Column } from "typeorm";
import {
  TerranoBaseEntity,
  ITerranoBaseEntity,
} from "../config/terrano-base-entity";

export enum MeasurementUnitSymbol {
  UN = "UN",
  KG = "KG",
  L = "L",
  M = "M",
  CX = "CX",
  PCT = "PCT",
  OTHER = "OTHER",
}

export enum MeasurementUnitType {
  MASS = "MASS",
  VOLUME = "VOLUME",
  LENGTH = "LENGTH",
  AREA = "AREA",
  UNIT = "UNIT",
}

export interface IMeasurementUnit extends ITerranoBaseEntity {
  name: string;
  symbol: MeasurementUnitSymbol;
  type: MeasurementUnitType;
}

@Entity("measurement_unit")
export class MeasurementUnit
  extends TerranoBaseEntity
  implements IMeasurementUnit
{
  @Column({ type: "varchar", length: 100, unique: true })
  name: string;

  @Column({
    type: "simple-enum",
    enum: MeasurementUnitSymbol,
    default: MeasurementUnitSymbol.UN,
  })
  symbol: MeasurementUnitSymbol;

  @Column({
    type: "simple-enum",
    enum: MeasurementUnitType,
    default: MeasurementUnitType.UNIT,
  })
  type: MeasurementUnitType;

  constructor(measurementUnit?: Partial<IMeasurementUnit>) {
    super(measurementUnit as IMeasurementUnit);
    if (measurementUnit) {
      Object.assign(this, measurementUnit);
    }
  }
}
