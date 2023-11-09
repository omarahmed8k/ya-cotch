import { LiteEntityDto } from '../../dto/liteEntityDto';
import { UserSubscriptionDto } from '../../subscriptions/dto/userSubscriptionDto';
import { OpeningDayDto } from './openingDayDto';
import { RestaurantManagerDto as ManagerDto } from './restaurantManagerDto';

export interface ShopDto {
  arLogo: string;
  enLogo: string;
  logo: string;
  arCover: string;
  enCover: string;
  cover: string;

  cityId: number;
  city: LiteEntityDto;
  street: string;
  buildingNumber: string;
  phoneNumber: string;
  manager: ManagerDto;
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
