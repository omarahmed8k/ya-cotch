import { LiteEntityDto } from "../../dto/liteEntityDto"

export interface UserSubscriptionDto {
    subscriptionId:number;
    userId:number;
    user:LiteEntityDto;
    creationTime:string;
    isExpired:boolean;
    name:string;
    fee:number;
    duration:number;
    remainingDays:number;
    id:number;
}
      