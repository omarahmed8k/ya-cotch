import { action, observable } from 'mobx';
import StoreBase from './storeBase';
import { EntityDto } from '../services/dto/entityDto';
import { notifySuccess } from '../lib/notifications';
import { ShopDto } from '../services/shops/dto/shopDto';
import shopsService from '../services/shops/shopsService';
import { CreateShopDto } from '../services/shops/dto/createShopDto';
import { UpdateShopDto } from '../services/shops/dto/updateShopDto';

class ShopStore extends StoreBase {
  @observable shops: Array<ShopDto> = [];
  @observable loadingShops = true;
  @observable isSubmittingShop = false;
  @observable maxResultCount: number = 1000;
  @observable skipCount: number = 0;
  @observable shopModel?: ShopDto = undefined;

  @observable totalCount: number = 0;
  @observable isActiveFilter?: boolean = undefined;
  @observable keyword?: string = undefined;
  @observable cityId?: number = undefined;
  @observable minRate?: number = undefined;
  @observable maxRate?: number = undefined;

  @action
  async getShops() {
    await this.wrapExecutionAsync(
      async () => {
        let result = await shopsService.getAll({
          skipCount: this.skipCount,
          maxResultCount: this.maxResultCount,
          isActive: this.isActiveFilter,
          keyword: this.keyword,
          cityId: this.cityId,
          maxRate: this.maxRate,
          minRate: this.minRate,
        });
        this.shops = result.items;
        this.totalCount = result.totalCount;
      },
      () => {
        this.loadingShops = true;
      },
      () => {
        this.loadingShops = false;
      }
    );
  }

  @action
  async createShop(input: CreateShopDto) {
    await this.wrapExecutionAsync(
      async () => {
        await shopsService.createShop(input);
        await this.getShops();
        notifySuccess();
      },
      () => {
        this.isSubmittingShop = true;
      },
      () => {
        this.isSubmittingShop = false;
      }
    );
  }

  @action
  async updateShop(input: UpdateShopDto) {
    await this.wrapExecutionAsync(
      async () => {
        await shopsService.updateShop(input);
        await this.getShops();
        notifySuccess();
      },
      () => {
        this.isSubmittingShop = true;
      },
      () => {
        this.isSubmittingShop = false;
      }
    );
  }

  @action
  async getShop(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        let shop = await shopsService.getShop(input);
        if (shop !== undefined) {
          this.shopModel = {
            arCover: shop.arCover,
            arLogo: shop.arLogo,
            arName: shop.arName,
            buildingNumber: shop.buildingNumber,
            city: shop.city,
            cityId: shop.cityId,
            subscription: shop.subscription,
            cover: shop.cover,
            creationTime: shop.creationTime,
            enCover: shop.enCover,
            enLogo: shop.enLogo,
            enName: shop.enName,
            facebookUrl: shop.facebookUrl,
            id: shop.id,
            instagramUrl: shop.instagramUrl,
            isActive: shop.isActive,
            logo: shop.logo,
            manager: shop.manager,
            name: shop.name,
            openingDays: shop.openingDays,
            phoneNumber: shop.phoneNumber,
            rate: shop.rate,
            street: shop.street,
            twitterUrl: shop.twitterUrl,
            websiteUrl: shop.websiteUrl,
            arDescription: shop.arDescription,
            enDescription: shop.enDescription,
            description: shop.description,
          };
        }
      },
      () => {
        this.loadingShops = true;
      },
      () => {
        this.loadingShops = false;
      }
    );
  }

  @action
  async shopActivation(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await shopsService.shopActivation(input);
        notifySuccess();
      },
      () => {
        this.loadingShops = true;
      },
      () => {
        this.loadingShops = false;
      }
    );
  }
  @action
  async shopDeactivation(input: EntityDto) {
    await this.wrapExecutionAsync(
      async () => {
        await shopsService.shopDeactivation(input);
        notifySuccess();
      },
      () => {
        this.loadingShops = true;
      },
      () => {
        this.loadingShops = false;
      }
    );
  }
}

export default ShopStore;
