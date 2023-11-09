import BookingRequestStatus from "../../types/bookingRequestStatus";

export interface ActionDto {
    bookingRequestId:number;
    creatorUserId:number;
    creatorUserName:string;
    creationTime:string;
    isCreate:boolean;
    targetStatus:BookingRequestStatus;
    id:number;
}
