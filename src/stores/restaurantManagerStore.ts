import { action, observable } from 'mobx';
import StoreBase from './storeBase';
import { EntityDto } from '../services/dto/entityDto';
import { notifySuccess } from '../lib/notifications';
import { RestaurantManagerDto } from '../services/restaurantManagers/dto/restaurantManagerDto';
import restaurantManagersService from '../services/restaurantManagers/restaurantManagersService';
import { UpdateRestaurantManagerDto } from '../services/restaurantManagers/dto/updateRestaurantManagerDto';

class RestaurantManagerStore extends StoreBase {
  @observable restaurantManagers: Array<RestaurantManagerDto> = [];
  @observable loadingRestaurantManagers = true;
  
  @observable isSubmittingRestaurantManager = false;

  @observable maxResultCount: number = 1000;
  @observable skipCount: number = 0;
  @observable totalCount: number = 0;
  @observable restaurantManagerModel?: RestaurantManagerDto = undefined;
  @observable isActiveFilter?: boolean = undefined;
  @observable keyword?: string = undefined;


  @action
  async getRestaurantManagers() {
    await this.wrapExecutionAsync(async () => {
      let result = await restaurantManagersService.getAll({
        skipCount: this.skipCount,
        maxResultCount: this.maxResultCount,
        isActive:this.isActiveFilter,
        keyword:this.keyword
      });

      this.restaurantManagers = result.items;
      this.totalCount =result.totalCount;
    }, () => {
      this.loadingRestaurantManagers = true;
    }, () => {
      this.loadingRestaurantManagers = false;
    });
  }  

  @action
  async getRestaurantManager(input: EntityDto) {
   
    await this.wrapExecutionAsync(async () => {
      let restaurantManager = await restaurantManagersService.getRestaurantManager(input);
      if (restaurantManager !== undefined) {
        this.restaurantManagerModel = {
          id: restaurantManager.id,
          restaurantId:restaurantManager.restaurantId,
        name:restaurantManager.name,
        emailAddress:restaurantManager.emailAddress,
        isActive:restaurantManager.isActive,
        lastLoginDate:restaurantManager.lastLoginDate,
        phoneNumber:restaurantManager.phoneNumber,
        restaurantName:restaurantManager.restaurantName
        };
      }
    }, () => {
      this.loadingRestaurantManagers = true;
    }, () => {
      this.loadingRestaurantManagers = false;
    });
  }

 
  @action
  async UpdateRestaurantManager(input: UpdateRestaurantManagerDto) {
    await this.wrapExecutionAsync(async () => {   
      await restaurantManagersService.restaurantManagerUpdate(input);
      notifySuccess();
    }, () => {
      this.isSubmittingRestaurantManager = true;
    }, () => {
      this.isSubmittingRestaurantManager = false;
    });
  }

  @action
  async restaurantManagerActivation(input: EntityDto) {
    await this.wrapExecutionAsync(async () => {   
      await restaurantManagersService.restaurantManagerActivation(input);
      notifySuccess();
    }, () => {
      this.loadingRestaurantManagers = true;
    }, () => {
      this.loadingRestaurantManagers = false;
    });
  }

  @action
  async restaurantManagerDeactivation(input: EntityDto) {
    await this.wrapExecutionAsync(async () => {   
      await restaurantManagersService.restaurantManagerDeactivation(input);
      notifySuccess();
    }, () => {
      this.loadingRestaurantManagers = true;
    }, () => {
      this.loadingRestaurantManagers = false;
    });
  }
}

export default RestaurantManagerStore;
