import { SimpleTraineeDto } from "../../bookingRequests/dto/simpleTraineeDto"
import ReportRefType from "../../types/reportRefType";

export interface ReportDto {
    id: number;
    description:string;
    creationTime:string;
    reporterId:number;
    reporter:SimpleTraineeDto;
    refId:number;
    refType:ReportRefType;
}


