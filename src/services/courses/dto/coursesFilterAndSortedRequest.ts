export interface CoursesFilterAndSortedRequest {
  maxResultCount: number;
  skipCount: number;
  isActive?:boolean;
  keyword?:string;
  categoryId?:number;
  trainerId?:number;
  traineeId?:number;
  hasDiscount?:boolean; 
}
