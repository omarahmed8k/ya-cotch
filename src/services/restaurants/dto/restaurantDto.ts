import { LiteEntityDto } from '../../dto/liteEntityDto';
import { UserSubscriptionDto } from '../../subscriptions/dto/userSubscriptionDto';
import { OpeningDayDto } from './openingDayDto';
import { RestaurantManagerDto } from './restaurantManagerDto';

export interface RestaurantDto {
  arLogo: string;
  enLogo: string;
  logo: string;
  arCover: string;
  enCover: string;
  cover: string;
  commercialRegisterNumber: string;
  commercialRegisterDocument: string;
  cityId: number;
  city: LiteEntityDto;
  street: string;
  buildingNumber: string;
  phoneNumber: string;
  manager: RestaurantManagerDto;
  facebookUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  websiteUrl: string;
  openingDays: Array<OpeningDayDto>;
  rate: number;
  creationTime: string;
  isActive: boolean;
  arName: string;
  enName: string;
  name: string;
  id: number;
  subscription: UserSubscriptionDto;
  arDescription: string;
  enDescription: string;
  description: string;
}
