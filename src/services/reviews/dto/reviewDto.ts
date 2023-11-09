import { SimpleTraineeDto } from "../../bookingRequests/dto/simpleTraineeDto"
import ReviewRefType from "../../types/reviewRefType";

export interface ReviewDto {
    id: number;
    rate:number;
    comment:string;
    creationTime:string;
    isHidden:boolean;
    reviewerId:number;
    reviewer:SimpleTraineeDto;
    refId:number;
    refType:ReviewRefType;
}
