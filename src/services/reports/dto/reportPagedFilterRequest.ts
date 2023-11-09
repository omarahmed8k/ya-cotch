import ReportRefType from "../../types/reportRefType";

export interface ReportPagedFilterRequest {
  maxResultCount?: number;
  skipCount?: number;
  refType?:ReportRefType;
  refId?:number;
  keyword?:string;
}
