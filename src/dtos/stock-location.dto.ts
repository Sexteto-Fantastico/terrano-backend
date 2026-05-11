import { StockLocation } from "../infra/entities/stock-location.entity";

export class CreateStockLocationDto {
    name: string;
    description?: string;

    address?: {
        street: string;
        number: string;
        neighborhood: string;
        city: string;
        state: string;
        country: string;
        complement?: string;
    };
}

export class UpdateStockLocationDto {
    name?: string;
    description?: string;

    address?: {
        street?: string;
        number?: string;
        neighborhood?: string;
        city?: string;
        state?: string;
        country?: string;
        complement?: string;
    };
}

export class StockLocationResponseDto {
    id: number;
    name: string;
    description?: string;
    deletedAt?: Date | null;
}

export const toStockLocationResponseDto = (entity: StockLocation): StockLocationResponseDto => ({
    id: entity.id,
    name: entity.name,
    description: entity.description,
    deletedAt: entity.deleted_at,
});

export const toStockLocationResponseDtoList = (list: StockLocation[]) =>
    list.map(toStockLocationResponseDto);