import { AppDataSource } from "../config/data-source";
import {
    MeasurementUnit,
    MeasurementUnitSymbol,
    MeasurementUnitType,
} from "../entities/measurement-unit.entity";

export async function createMeasurementUnitSeed(): Promise<void> {
    const repository = AppDataSource.getRepository(MeasurementUnit);

    const units = [
        {
            name: "Unidade",
            symbol: MeasurementUnitSymbol.UN,
            type: MeasurementUnitType.UNIT,
        },
        {
            name: "Caixa",
            symbol: MeasurementUnitSymbol.CX,
            type: MeasurementUnitType.UNIT,
        },
        {
            name: "Pacote",
            symbol: MeasurementUnitSymbol.PCT,
            type: MeasurementUnitType.UNIT,
        },
        {
            name: "Quilograma",
            symbol: MeasurementUnitSymbol.KG,
            type: MeasurementUnitType.MASS,
        },
        {
            name: "Litro",
            symbol: MeasurementUnitSymbol.L,
            type: MeasurementUnitType.VOLUME,
        },
        {
            name: "Metro",
            symbol: MeasurementUnitSymbol.M,
            type: MeasurementUnitType.LENGTH,
        },
    ];

    for (const unitData of units) {
        const exists = await repository.findOne({
            where: {
                name: unitData.name,
            },
        });

        if (exists) continue;

        await repository.save(
            repository.create(unitData)
        );
    }

    console.log("MeasurementUnit seed completed");
}