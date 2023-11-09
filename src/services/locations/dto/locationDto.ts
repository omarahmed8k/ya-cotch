import { LiteEntityDto } from "../../dto/liteEntityDto";

export interface LocationDto {
    id: number;
    arName: string;
    enName: string;
    parentId: number;
    parent: LiteEntityDto;
    isActive:boolean;
}
