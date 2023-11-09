export interface RestaurantsFilterAndSortedRequest {
  maxResultCount: number;
  skipCount: number;
  isActive?:boolean;
  keyword?:string;
  cityId?:number;
  minRate?:number;
  maxRate?:number; 
}
