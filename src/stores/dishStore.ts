import { action, observable } from 'mobx';
import StoreBase from './storeBase';
import { EntityDto } from '../services/dto/entityDto';
import { notifySuccess } from '../lib/notifications';
import { DishDto } from '../services/dishes/dto/dishDto';
import dishesService from '../services/dishes/dishesService';
import { CreateDishDto } from '../services/dishes/dto/createDishDto';
import { UpdateDishDto } from '../services/dishes/dto/updateDishDto';

class DishStore extends StoreBase {
  @observable dishes: Array<DishDto> = [];
  @observable loadingDishes = true;
  @observable isSubmittingDish = false;
  @observable maxResultCount: number = 1000;
  @observable skipCount: number = 0;
  @observable dishModel?: DishDto = undefined;
  
  @observable totalCount: number = 0;
  @observable isActiveFilter?: boolean = undefined;
  @observable keyword?: string = undefined;
  @observable categoryId?: number = undefined;
  @observable restaurantId?: number = undefined;
  @observable maxPrice?: number = undefined;
  @observable minPrice?: number = undefined;

  @action
  async getDishes() {
    await this.wrapExecutionAsync(async () => {
      let result = await dishesService.getAll({
          skipCount:this.skipCount,
          maxResultCount:this.maxResultCount,
          isActive:this.isActiveFilter,
          keyword:this.keyword,
          categoryId:this.categoryId,
          maxPrice:this.maxPrice,
          minPrice:this.minPrice,
          restaurantId:this.restaurantId
      });
      this.dishes = result.items;
      this.totalCount=result.totalCount;
    }, () => {
      this.loadingDishes = true;
    }, () => {
      this.loadingDishes = false;
    });
  }

  @action
  async createDish(input: CreateDishDto) {
    await this.wrapExecutionAsync(async () => {
      await dishesService.createDish(input);
      await this.getDishes();
      notifySuccess();
    }, () => {
      this.isSubmittingDish = true;
    }, () => {
      this.isSubmittingDish = false;
    });
  }

  @action
  async updateDish(input: UpdateDishDto) {
    await this.wrapExecutionAsync(async () => {
      await dishesService.updateDish(input);
      await this.getDishes();
      notifySuccess();
    }, () => {
      this.isSubmittingDish = true;
    }, () => {
      this.isSubmittingDish = false;
    });
  }


  @action
  async getDish(input: EntityDto) {
    await this.wrapExecutionAsync(async () => {
      let dish = await dishesService.getDish(input);
      if (dish !== undefined) {
        this.dishModel = {
          id: dish.id,
          arComponents:dish.arComponents,
          arName:dish.arName,
          category:dish.category,
          categoryId:dish.categoryId,
          components:dish.components,
          creationTime:dish.creationTime,
          enComponents:dish.enComponents,
          enName:dish.enName,
          images:dish.images,
          isActive:dish.isActive,
          name:dish.name,
          price:dish.price,
          rate:dish.rate,
          restaurant:dish.restaurant,
          restaurantId:dish.restaurantId
        };
      }
    }, () => {
      this.loadingDishes = true;
    }, () => {
      this.loadingDishes = false;
    });
  }


  @action
  async dishActivation(input: EntityDto) {
    await this.wrapExecutionAsync(async () => {   
      await dishesService.dishActivation(input);
      await this.getDishes();
      notifySuccess();
    }, () => {
      this.loadingDishes = true;
    }, () => {
      this.loadingDishes = false;
    });
  }
  @action
  async dishDeactivation(input: EntityDto) {
    await this.wrapExecutionAsync(async () => {   
      await dishesService.dishDeactivation(input);
      await this.getDishes();
      notifySuccess();
    }, () => {
      this.loadingDishes = true;
    }, () => {
      this.loadingDishes = false;
    });
  }

}

export default DishStore;
