export interface CreateDepartmentDto {
    name: string;
    cost_center_code: string;
    manager_id: number;
}

export interface UpdateDepartmentDto {
    name?: string;
    cost_center_code?: string;
    manager_id?: number;
}

export interface DepartmentResponseDto {
    id: number;
    name: string;
    cost_center_code: string;
    manager_id: number;
    created_at: Date;
    updated_at: Date;
    deleted_at?: Date;
}

export const toDepartmentResponseDto = (dept: any): DepartmentResponseDto => ({
    id: dept.id,
    name: dept.name,
    cost_center_code: dept.cost_center_code,
    manager_id: dept.manager?.id,
    created_at: dept.created_at,
    updated_at: dept.updated_at,
    deleted_at: dept.deleted_at,
});

export const toDepartmentResponseDtoList = (list: any[]) =>
    list.map(toDepartmentResponseDto);