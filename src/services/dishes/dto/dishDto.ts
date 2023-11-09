import { LiteEntityDto } from "../../dto/liteEntityDto";

export interface DishDto {
    enComponents:string;
    arComponents:string;
    components:string;
    price:number;
    restaurantId:number;
    restaurant:LiteEntityDto;
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
      