import { SimpleTraineeDto } from "../../bookingRequests/dto/simpleTraineeDto"
import { LiteEntityDto } from "../../dto/liteEntityDto"
import OrderStatus from "../../types/orderStatus"
import PaymentMethod from "../../types/paymentMethod"
import { OrderActionDto } from "./orderActionDto"
import { OrderItemDto } from "./orderItemDto"

export interface OrderDto {
    number:string;
    traineeId:number;
    trainee:SimpleTraineeDto;
    restaurantId:number;
    restaurant:LiteEntityDto;
    shopId:number;
    shop:LiteEntityDto;
    status:OrderStatus;
    creationTime:string;
    paymentMethod:PaymentMethod;
    transactionId:string;
    paidAmount:number;
    actions:Array<OrderActionDto>;
    items:Array<OrderItemDto>;
    id:number;
}
