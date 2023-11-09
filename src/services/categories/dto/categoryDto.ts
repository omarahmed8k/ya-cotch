import CategoryType from "../../types/categoryType";

export interface CategoryDto {
    id:number;
    arName: string;
    enName: string;
    imageUrl: string;
    iconUrl?: string;
    isActive : boolean;
    type:CategoryType;
}
      