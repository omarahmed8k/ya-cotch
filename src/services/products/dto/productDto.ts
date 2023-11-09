import { LiteEntityDto } from "../../dto/liteEntityDto";

export interface ProductDto {
    enComponents:string;
    arComponents:string;
    components:string;
    price:number;
    shopId:number;
    shop:LiteEntityDto;
    categoryId:number;
    category:LiteEntityDto;
    creationTime:string;
    images:Array<string>;
    rate:number;
    isActive:boolean;
    arName:string;
    enName:string;
    name:string;
    id:number;
}
      