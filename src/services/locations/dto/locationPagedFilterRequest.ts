export interface LocationPagedFilterRequest {
  maxResultCount?: number;
  skipCount?: number;
  type?: number;
  parentId?:number;
  isActive?:boolean;
  keyword?:string;
}
