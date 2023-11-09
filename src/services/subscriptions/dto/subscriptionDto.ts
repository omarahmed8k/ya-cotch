import SubscriptionTarget from "../../types/subscriptionTarget";
import { UserSubscriptionDto } from "./userSubscriptionDto";

export interface SubscriptionDto {
    name:string;
    fee:number;
    colorCode:string;
    duration:number;
    target:SubscriptionTarget; 
    priceFrom:number;
    priceTo:number;
    requestsCount:number;
    itemsCount:number;
    usedSubscriptions:Array<UserSubscriptionDto>;
    isActive:boolean;
    id:number;
    creationTime:string;
}
      