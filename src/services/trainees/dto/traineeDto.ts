import { LiteEntityDto } from "../../dto/liteEntityDto"
import Gender from "../../types/gender"
import UserStatus from "../../types/userStatus"

export interface TraineeDto {
    birthDate:string;
    age:number;
    name:string;
    gender:Gender;
    address:string;
    emailAddress:string;
    phoneNumber:string;
    countryCode:string;
    length:number;
    weight:number;
    bmi:number;
    lastLoginDate:string;
    appliedCoursesCount:number;
    imageUrl:string;
    status: UserStatus;
    isVerified:boolean;
    isActive:boolean;
    appliedCourses:Array<LiteEntityDto>;
    id:number;
}
      