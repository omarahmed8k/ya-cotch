import ReviewRefType from "../../types/reviewRefType";

export interface ReviewPagedFilterRequest {
  maxResultCount?: number;
  skipCount?: number;
  isHidden?: boolean;
  refType?:ReviewRefType;
  refId?:number;
}
