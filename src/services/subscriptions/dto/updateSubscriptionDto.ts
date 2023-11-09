import SubscriptionTarget from "../../types/subscriptionTarget";
export interface UpdateSubscriptionDto {
    id:number;
    name:string;
    fee:number;
    colorCode:string;
    duration:number;
    target:SubscriptionTarget; 
    priceFrom:number;
    priceTo:number;
    requestsCount:number;
    itemsCount:number;
}
      