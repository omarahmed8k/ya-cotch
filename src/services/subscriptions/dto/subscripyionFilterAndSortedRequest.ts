import SubscriptionTarget from "../../types/subscriptionTarget";

export interface SubscriptionsFilterAndSortedRequest {
  maxResultCount?: number;
  skipCount?: number;
  isActive?:boolean;
  keyword?:string;
  target?:SubscriptionTarget;
}
