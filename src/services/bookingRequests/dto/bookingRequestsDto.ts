import { LiteEntityDto } from "../../dto/liteEntityDto"
import BookingRequestStatus from "../../types/bookingRequestStatus"
import PaymentMethod from "../../types/paymentMethod"
import { ActionDto } from "./actionDto"
import { SimpleTraineeDto } from "./simpleTraineeDto"

export interface BookingRequestsDto {
    traineeId:number;
    trainee: SimpleTraineeDto;
    courseId:number;
    course:LiteEntityDto;
    creationTime:string;
    paymentMethod:PaymentMethod;
    status:BookingRequestStatus;
    transactionId:string;
    paidAmount:number;
    actions:Array<ActionDto>;
    id:number;
}
