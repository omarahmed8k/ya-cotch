import { LiteEntityDto } from "../../dto/liteEntityDto"

export interface OrderItemDto {
    orderId:number;
    dishId:number;
    dish:LiteEntityDto;
    productId:number;
    price:number;
    quantity:number;
    product:LiteEntityDto;
    creationTime:string;
    id:number;
}
