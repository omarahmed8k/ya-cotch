import { LiteEntityDto } from "../../dto/liteEntityDto";
import { SimpleTrainerDto } from "../../trainers/dto/simpleTrainerDto";

export interface CourseDto {
    imageUrl:string;
fee	:number;
creationTime:	string;
creatorUserId:	number;
createdBy	:string;
hasDiscount:	boolean;
discountPercentage	:number;
trainerId:number;
trainer	:SimpleTrainerDto;
categoryId:	number;
category:LiteEntityDto;
trainingHoursCount:number;
viewsCount:number;
arDescription:string;
enDescription:string;
description	:string;
bookingRequestsCount:number;
traineesCount:number;
isActive	:boolean;
arName:	string
enName	:string
name:	string
id	:number;
}
      