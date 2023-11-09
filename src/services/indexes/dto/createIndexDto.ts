import IndexType from "../../types/indexType";

export interface CreateIndexDto {
    arName: string;
    enName: string;
    type: IndexType;
}
