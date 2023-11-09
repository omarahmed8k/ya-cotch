export interface DishesFilterAndSortedRequest {
  maxResultCount?: number;
  skipCount?: number;
  isActive?:boolean;
  keyword?:string;
  categoryId?:number;
  restaurantId?:number;
  minPrice?:number;
  maxPrice?:number; 
}
