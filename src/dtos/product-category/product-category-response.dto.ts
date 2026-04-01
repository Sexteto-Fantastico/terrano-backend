export class ProductCategoryParentDto {
    id: string;
    name: string;
    description?: string;
    deleted_at?: Date | null;

    constructor(data: ProductCategoryParentDto) {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.deleted_at = data.deleted_at;
    }
}

export class ProductCategoryResponseDto {
    id: string;
    name: string;
    description?: string;
    deleted_at?: Date | null;
    parent?: ProductCategoryParentDto | null;

    constructor(data: ProductCategoryResponseDto) {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.deleted_at = data.deleted_at;
        this.parent = data.parent ? new ProductCategoryParentDto(data.parent) : null;
    }
}
