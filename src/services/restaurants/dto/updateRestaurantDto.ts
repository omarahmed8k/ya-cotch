import { OpeningDayDto } from "./openingDayDto";

export interface UpdateRestaurantDto {
    id:number;
    arName:string;
    enName:string;
    arLogo:string;
    enLogo:string;
    arCover:	string;
    enCover:string;
    commercialRegisterNumber:string;
    commercialRegisterDocument:string;
    cityId:number;
    street:string;
    buildingNumber:string;
    phoneNumber:string;
    facebookUrl:string;
    instagramUrl:string;
    twitterUrl:string;
    websiteUrl:string;
    openingDays:Array<OpeningDayDto>;
}
      