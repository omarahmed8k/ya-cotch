import CategoryType from "../../types/categoryType";

export interface UpdateCategoryDto {
    id:number;
    arName: string;
    enName: string;
    imageUrl?: string;
    iconUrl?: string;
    type:CategoryType;
}
      