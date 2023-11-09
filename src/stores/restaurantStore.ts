import { action, observable } from 'mobx';
import StoreBase from './storeBase';
import { EntityDto } from '../services/dto/entityDto';
import { notifySuccess } from '../lib/notifications';
import { RestaurantDto } from '../services/restaurants/dto/restaurantDto';
import restaurantsService from '../services/restaurants/restaurantsService';
import { CreateRestaurantDto } from '../services/restaurants/dto/createRestaurantDto';
import { UpdateRestaurantDto } from '../services/restaurants/dto/updateRestaurantDto';

class RestaurantStore extends StoreBase {
  @observable restaurants: Array<RestaurantDto> = [];
  @observable loadingRestaurants = true;
  @observable isSubmittingRestaurant = false;
  @observable maxResultCount: number = 1000;
  @observable skipCount: number = 0;
  @observable restaurantModel?: RestaurantDto = undefined;

  @observable totalCount: number = 0;
  @observable isActiveFilter?: boolean = undefined;
  @observable keyword?: string = undefined;
  @observable cityId?: number = undefined;
  @observable minRate?: number = undefined;
  @observable maxRate?: number = undefined;

  @action
  async getRestaurants() {
    await this.wrapExecutionAsync(
      async () => {
        let result = await restaurantsService.getAll({
          skipCount: this.skipCount,
          maxResultCount: this.maxResultCount,
          isActive: this.isActiveFilter,
          keyword: this.keyword,
          cityId: this.cityId,
          maxRate: this.maxRate,
          minRate: this.minRate,
        });
        this.restaurants = result.items;
        this.totalCount = result.totalCount;
      },
      () => {
        this.loadingRestaurants = true;
      },
      () => {
        this.loadingRestaurants = false;
      }
    );
  }

  @action
  async createRestaurant(input: CreateRestaurantDto) {
    await this.wrapExecutionAsync(
      async () => {
        await restaurantsService.createRestaurant(input);
        await this.getRestaurants();
        notifySuccess();
      },
      () => {
        this.isSubmittingRestaurant = true;
      },
      () => {
        this.isSubmittingRestaurant = false;
      }
    );
  }

  @action
  async updateRestaurant(input: UpdateRestaurantDto) {
    await this.wrapExecutionAsync(
      async () => {
        await restaurantsService.updateRestaurant(input);
        await this.getRestaurants();
        notifySuccess();
      },
      () => {
        this.isSubmittingRestaurant = true;
      },
      () => {
        this.isSubmittingRestaurant = false;
      }
    );
  }

  @action
  async getRestaurant(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        let restaurant = await restaurantsService.getRestaurant(input);
        if (restaurant !== undefined) {
          this.restaurantModel = {
            arCover: restaurant.arCover,
            arLogo: restaurant.arLogo,
            arName: restaurant.arName,
            subscription: restaurant.subscription,
            buildingNumber: restaurant.buildingNumber,
            city: restaurant.city,
            cityId: restaurant.cityId,
            commercialRegisterDocument: restaurant.commercialRegisterDocument,
            commercialRegisterNumber: restaurant.commercialRegisterNumber,
            cover: restaurant.cover,
            creationTime: restaurant.creationTime,
            enCover: restaurant.enCover,
            enLogo: restaurant.enLogo,
            enName: restaurant.enName,
            facebookUrl: restaurant.facebookUrl,
            id: restaurant.id,
            instagramUrl: restaurant.instagramUrl,
            isActive: restaurant.isActive,
            logo: restaurant.logo,
            manager: restaurant.manager,
            name: restaurant.name,
            openingDays: restaurant.openingDays,
            phoneNumber: restaurant.phoneNumber,
            rate: restaurant.rate,
            street: restaurant.street,
            twitterUrl: restaurant.twitterUrl,
            websiteUrl: restaurant.websiteUrl,
            arDescription: restaurant.arDescription,
            enDescription: restaurant.enDescription,
            description: restaurant.description,
          };
        }
      },
      () => {
        this.loadingRestaurants = true;
      },
      () => {
        this.loadingRestaurants = false;
      }
    );
  }

  @action
  async restaurantActivation(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await restaurantsService.restaurantActivation(input);
        notifySuccess();
      },
      () => {
        this.loadingRestaurants = true;
      },
      () => {
        this.loadingRestaurants = false;
      }
    );
  }
  @action
  async restaurantDeactivation(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await restaurantsService.restaurantDeactivation(input);
        notifySuccess();
      },
      () => {
        this.loadingRestaurants = true;
      },
      () => {
        this.loadingRestaurants = false;
      }
    );
  }
}

export default RestaurantStore;
