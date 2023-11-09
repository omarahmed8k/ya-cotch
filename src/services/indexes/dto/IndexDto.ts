import IndexType from "../../types/indexType";

export interface IndexDto {
    id: number;
    arName: string;
    enName: string;
    name: string;
    type: IndexType;
    isActive:boolean;
}
