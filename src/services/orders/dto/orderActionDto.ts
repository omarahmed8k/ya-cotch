import OrderStatus from "../../types/orderStatus"

export interface OrderActionDto {
    orderId:number;
    creatorUserId:number;
    creatorUserName:string;
    creationTime:string;
    isCreate:boolean;
    targetStatus:OrderStatus;
    id:number;
}
