import PaymentMethod from "../../types/paymentMethod";

export interface PaymentsPagedFilterRequest {
  maxResultCount: number;
  skipCount: number;
  isActive?: boolean;
  keyword?: string;
  method?:PaymentMethod;
  courseId?:number;
  trainerId?:number;
  shopId?:number;
  restaurantId?:number;

}
