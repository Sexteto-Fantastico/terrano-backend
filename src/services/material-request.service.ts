import {
    CreateMaterialRequestDto,
    UpdateMaterialRequestDto,
    MaterialRequestResponseDto,
    toMaterialRequestResponseDto,
    toMaterialRequestResponseDtoList,
} from "../dtos/material-request.dto";

import { NotFoundError, BadRequestError } from "../errors/app-error";

import * as MaterialRequestRepository from "../repositories/material-request.repository";
import * as ProductRepository from "../repositories/product.repository";
import * as UserRepository from "../repositories/user.repository";

import {
    MaterialRequestStatus,
} from "../infra/entities/material-request.entity";
import { MaterialRequestItem } from "../infra/entities/material-request-item.entity";


async function getMaterialRequests(filters: {
    status?: MaterialRequestStatus;
    startDate?: string;
    endDate?: string;
    openOnly?: boolean;
    pageIndex?: number;
    pageSize?: number;
} = {}): Promise<[MaterialRequestResponseDto[], number]> {

    const [requests, total] =
        await MaterialRequestRepository.getMaterialRequests(filters);

    return [toMaterialRequestResponseDtoList(requests), total];
}

async function getMaterialRequestById(
    id: number
): Promise<MaterialRequestResponseDto> {

    const request =
        await MaterialRequestRepository.getMaterialRequestById(id);

    if (!request) {
        throw new NotFoundError("Material request not found");
    }

    return toMaterialRequestResponseDto(request);
}

async function createMaterialRequest(
    data: CreateMaterialRequestDto
): Promise<MaterialRequestResponseDto> {

    const items: Partial<MaterialRequestItem>[] = [];

    for (const item of data.items) {
        const product =
            await ProductRepository.getProductById(item.productId);

        if (!product) {
            throw new NotFoundError(
                `Product ${item.productId} not found`
            );
        }

        items.push({
            product,
            quantity: item.quantity,
            delivered: false,
        });
    }

   const saved =
    await MaterialRequestRepository.saveMaterialRequest({
        requester_justification: data.requesterJustification,
        status: MaterialRequestStatus.PENDING,
        items: items as MaterialRequestItem[],
    });

    return toMaterialRequestResponseDto(saved);
}


async function updateMaterialRequest(
    id: number,
    data: UpdateMaterialRequestDto
): Promise<MaterialRequestResponseDto> {

    const request =
        await MaterialRequestRepository.getMaterialRequestById(id);

    if (!request) {
        throw new NotFoundError("Material request not found");
    }

    if (request.status !== MaterialRequestStatus.PENDING) {
        throw new BadRequestError(
            "Only pending requests can be updated"
        );
    }

    if (data.items) {
        for (const item of data.items) {
            const product =
                await ProductRepository.getProductById(item.productId);

            if (!product) {
                throw new NotFoundError(
                    `Product ${item.productId} not found`
                );
            }
        }
    }

    if (data.requesterJustification !== undefined) {
        request.requester_justification =
            data.requesterJustification;
    }

    const saved =
    await MaterialRequestRepository.updateMaterialRequest(
        request
    );

    return toMaterialRequestResponseDto(saved);
}

async function deleteMaterialRequest(
    id: number
): Promise<boolean> {

    const request =
        await MaterialRequestRepository.getMaterialRequestById(id);

    if (!request) {
        throw new NotFoundError("Material request not found");
    }

    if (request.status !== MaterialRequestStatus.PENDING) {
        throw new BadRequestError(
            "Only pending requests can be cancelled"
        );
    }

    return MaterialRequestRepository.deleteMaterialRequest(id);
}

export {
    getMaterialRequests,
    getMaterialRequestById,
    createMaterialRequest,
    updateMaterialRequest,
    deleteMaterialRequest,
};