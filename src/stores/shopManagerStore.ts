import { action, observable } from 'mobx';
import StoreBase from './storeBase';
import { EntityDto } from '../services/dto/entityDto';
import { notifySuccess } from '../lib/notifications';
import { ShopManagerDto } from '../services/shopManagers/dto/shopManagerDto';
import shopManagersService from '../services/shopManagers/shopManagersService';
import { UpdateShopManagerDto } from '../services/shopManagers/dto/updateShopManagerDto';

class ShopManagerStore extends StoreBase {
  @observable shopManagers: Array<ShopManagerDto> = [];
  @observable loadingShopManagers = true;
  
  @observable isSubmittingShopManager = false;

  @observable maxResultCount: number = 1000;
  @observable skipCount: number = 0;
  @observable totalCount: number = 0;
  @observable shopManagerModel?: ShopManagerDto = undefined;
  @observable isActiveFilter?: boolean = undefined;
  @observable keyword?: string = undefined;


  @action
  async getShopManagers() {
    await this.wrapExecutionAsync(async () => {
      let result = await shopManagersService.getAll({
        skipCount: this.skipCount,
        maxResultCount: this.maxResultCount,
        isActive:this.isActiveFilter,
        keyword:this.keyword
      });

      this.shopManagers = result.items;
      this.totalCount =result.totalCount;
    }, () => {
      this.loadingShopManagers = true;
    }, () => {
      this.loadingShopManagers = false;
    });
  }  

  @action
  async getShopManager(input: EntityDto) {
   
    await this.wrapExecutionAsync(async () => {
      let shopManager = await shopManagersService.getShopManager(input);
      if (shopManager !== undefined) {
        this.shopManagerModel = {
          id: shopManager.id,
          shopId:shopManager.shopId,
        name:shopManager.name,
        emailAddress:shopManager.emailAddress,
        isActive:shopManager.isActive,
        lastLoginDate:shopManager.lastLoginDate,
        phoneNumber:shopManager.phoneNumber,
        shopName:shopManager.shopName
        };
      }
    }, () => {
      this.loadingShopManagers = true;
    }, () => {
      this.loadingShopManagers = false;
    });
  }

 
  @action
  async UpdateShopManager(input: UpdateShopManagerDto) {
    await this.wrapExecutionAsync(async () => {   
      await shopManagersService.shopManagerUpdate(input);
      notifySuccess();
    }, () => {
      this.isSubmittingShopManager = true;
    }, () => {
      this.isSubmittingShopManager = false;
    });
  }

  @action
  async shopManagerActivation(input: EntityDto) {
    await this.wrapExecutionAsync(async () => {   
      await shopManagersService.shopManagerActivation(input);
      notifySuccess();
    }, () => {
      this.loadingShopManagers = true;
    }, () => {
      this.loadingShopManagers = false;
    });
  }

  @action
  async shopManagerDeactivation(input: EntityDto) {
    await this.wrapExecutionAsync(async () => {   
      await shopManagersService.shopManagerDeactivation(input);
      notifySuccess();
    }, () => {
      this.loadingShopManagers = true;
    }, () => {
      this.loadingShopManagers = false;
    });
  }
}

export default ShopManagerStore;
