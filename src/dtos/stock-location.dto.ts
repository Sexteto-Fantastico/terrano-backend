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
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
}

export const toStockLocationResponseDto = (entity: StockLocation): StockLocationResponseDto => ({
    id: entity.id,
    name: entity.name,
    description: entity.description,
    createdAt: entity.created_at,
    updatedAt: entity.updated_at,
    deletedAt: entity.deleted_at,
});

export const toStockLocationResponseDtoList = (list: StockLocation[]) =>
    list.map(toStockLocationResponseDto);