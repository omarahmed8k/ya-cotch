import { OpeningDayDto } from "./openingDayDto";

export interface CreateShopDto {
    arName:string;
    enName:string;
    arLogo:string;
    enLogo:string;
    arCover:	string;
    enCover:string;

    cityId:number;
    street:string;
    buildingNumber:string;
    phoneNumber:string;
    managerName:string;
    managerPhoneNumber:string;
    managerPassword:string;
    facebookUrl:string;
    instagramUrl:string;
    twitterUrl:string;
    websiteUrl:string;
    openingDays:Array<OpeningDayDto>;
}
      