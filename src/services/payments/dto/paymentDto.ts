import { LiteEntityDto } from "../../dto/liteEntityDto"
import PaymentMethod from "../../types/paymentMethod"

export interface PaymentDto {
    transactionId:string;
    receiptId:number;
    receipt:LiteEntityDto;
    senderId:number;
    sender:LiteEntityDto;
    amount:number;
    creationTime:string;
    method:PaymentMethod;
    id:number;
    orderNumber:string;
    bookingRequestId:number;
}
