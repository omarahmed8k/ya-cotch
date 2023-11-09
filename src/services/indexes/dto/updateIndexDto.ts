import IndexType from "../../types/indexType";

export interface UpdateIndexDto {
    id: number;
    arName: string;
    enName: string;
    type: IndexType;
}
