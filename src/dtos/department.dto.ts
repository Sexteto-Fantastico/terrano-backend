export class CreateDepartmentDto {
    name: string;
    costCenterCode: string;
    managerId: number;
}

export class UpdateDepartmentDto {
    name?: string;
    costCenterCode?: string;
    managerId?: number;
}

export class DepartmentResponseDto {
    id: number;
    name: string;
    costCenterCode: string;
    managerId?: number;
    deletedAt?: Date;
}

export const toDepartmentResponseDto = (dept: any): DepartmentResponseDto => ({
    id: dept.id,
    name: dept.name,
    costCenterCode: dept.cost_center_code,
    managerId: dept.manager?.id || dept.manager_id,
    deletedAt: dept.deleted_at,
});

export const toDepartmentResponseDtoList = (list: any[]) =>
    list.map(toDepartmentResponseDto);