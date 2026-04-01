export class UpdateProductCategoryDto {
    name?: string;
    description?: string;
    parent_id?: string | null;

    constructor(data: UpdateProductCategoryDto) {
        this.name = data.name;
        this.description = data.description;
        this.parent_id = data.parent_id;
    }
}
