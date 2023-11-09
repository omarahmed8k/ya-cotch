import Gender from "../../types/gender";

export interface UpdateTraineeDto {
    birthDate:string;
    gender:Gender;
    address:string;
    length:number;
    weight:number;
    name:string;
    countryCode	:string;
    emailAddress:string;
    phoneNumber:string;
    password:string;
    imageUrl:string;
    id:number;
}
      