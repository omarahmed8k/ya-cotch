export interface IndexPagedFilterRequest {
  maxResultCount?: number;
  skipCount?: number;
  type?: number;
  isActive?:boolean;
  keyword?:string;
}
