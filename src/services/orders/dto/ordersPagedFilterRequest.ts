import OrderStatus from "../../types/orderStatus";

export interface OrdersPagedFilterRequest {
  maxResultCount?: number;
  skipCount?: number;
  isActive?: boolean;
  keyword?: string;
  restaurantId?:number;
  shopId?:number;
  status?:OrderStatus;
  isFromRestaurants?:boolean;

}
