import { LiteEntityDto } from "../../dto/liteEntityDto"
import UserStatus from "../../types/userStatus"

export interface TrainerDto {
    birthDate:string;
    yearsOfExperience:number;
    specializationId:number;
    specialization: LiteEntityDto;
    age:number;
    name:string;
    cvUrl:string;
    emailAddress:string;
    phoneNumber:string;
    countryCode:string;
    lastLoginDate:string;
    coursesCount:number;
    rate:number;
    imageUrl:string;
    id:number;
    isActive:boolean;
    status:UserStatus;
    isVerified:boolean;
    address:string;
    gender:number;
}
      