import { StockLocation } from "../infra/entities/stock-location.entity";

export class CreateStockLocationDto {
    name: string;
    description?: string;
}

export class UpdateStockLocationDto {
    name?: string;
    description?: string;
}

export class StockLocationResponseDto {
    id: number;
    name: string;
    description?: string;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
}

export const toStockLocationResponseDto = (entity: StockLocation): StockLocationResponseDto => ({
    id: entity.id,
    name: entity.name,
    description: entity.description,
    created_at: entity.created_at,
    updated_at: entity.updated_at,
    deleted_at: entity.deleted_at,
});

export const toStockLocationResponseDtoList = (list: StockLocation[]) =>
    list.map(toStockLocationResponseDto);