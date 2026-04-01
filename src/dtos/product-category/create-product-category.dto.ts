export class CreateProductCategoryDto {
    name: string;
    description?: string;
    parent_id?: string;

    constructor(data: CreateProductCategoryDto) {
        this.name = data.name;
        this.description = data.description;
        this.parent_id = data.parent_id;
    }
}
