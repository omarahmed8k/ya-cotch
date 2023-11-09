export interface PagedFilterAndSortedRequest {
  maxResultCount?: number;
  skipCount?: number;
  isActive?:boolean;
  keyword?:string;
  type?:number;
  isVerified?:boolean;
  specializationId?:number;
  status?:number;
  gender?:number;
}
