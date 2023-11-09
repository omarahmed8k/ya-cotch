import BookingRequestStatus from "../../types/bookingRequestStatus";

export interface BookingRequestsPagedFilterRequest {
  maxResultCount: number;
  skipCount: number;
  isActive?: boolean;
  keyword?: string;
  courseId?:number;
  status?:BookingRequestStatus;

}
