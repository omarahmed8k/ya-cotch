import CategoryType from "../../types/categoryType";
export interface CreateCategoryDto {
    arName: string;
    enName: string;
    imageUrl: string;
    iconUrl?: string;
    type:CategoryType;
}
      