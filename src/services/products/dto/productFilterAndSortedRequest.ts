export interface ProductsFilterAndSortedRequest {
  maxResultCount?: number;
  skipCount?: number;
  isActive?:boolean;
  keyword?:string;
  categoryId?:number;
  shopId?:number;
  minPrice?:number;
  maxPrice?:number; 
}
