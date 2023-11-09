import { action, observable } from 'mobx';
import StoreBase from './storeBase';
import { CategoryDto } from '../services/categories/dto/categoryDto';
import categoriesService from '../services/categories/categoriesService';
import { CreateCategoryDto } from '../services/categories/dto/createCategoryDto';
import { UpdateCategoryDto } from '../services/categories/dto/updateCategoryDto';
import { EntityDto } from '../services/dto/entityDto';
import { notifySuccess } from '../lib/notifications';
import CategoryType from '../services/types/categoryType';

class CategoryStore extends StoreBase {
  @observable categories: Array<CategoryDto> = [];
  @observable loadingCategories = true;
  @observable isSubmittingCategory = false;
  @observable maxResultCount: number = 1000;
  @observable skipCount: number = 0;
  @observable categoryModel?: CategoryDto = undefined;
  
  @observable totalCount: number = 0;
  @observable type?: CategoryType = undefined;

  @observable isActiveFilter?: boolean = undefined;
  @observable keyword?: string = undefined;


  @action
  async getCategories() {
    await this.wrapExecutionAsync(async () => {
      let result = await categoriesService.getAll({
          skipCount:this.skipCount,
          maxResultCount:this.maxResultCount,
          isActive:this.isActiveFilter,
          keyword:this.keyword,
          type:this.type
      });
      this.categories = result.items;
      this.totalCount=result.totalCount;
    }, () => {
      this.loadingCategories = true;
    }, () => {
      this.loadingCategories = false;
    });
  }

  @action
  async createCategory(input: CreateCategoryDto) {
    await this.wrapExecutionAsync(async () => {
      await categoriesService.createCategory(input);
      await this.getCategories();
      notifySuccess();
    }, () => {
      this.isSubmittingCategory = true;
    }, () => {
      this.isSubmittingCategory = false;
    });
  }

  @action
  async updateCategory(input: UpdateCategoryDto) {
    await this.wrapExecutionAsync(async () => {
      await categoriesService.updateCategory(input);
      await this.getCategories();
      notifySuccess();
    }, () => {
      this.isSubmittingCategory = true;
    }, () => {
      this.isSubmittingCategory = false;
    });
  }


  @action
  async getCategory(input: EntityDto) {
    let category = this.categories.find(c => c.id === input.id);
    if (category !== undefined) {
      this.categoryModel = {
        id: category.id,
        type:category.type,
        imageUrl: category.imageUrl,
        iconUrl: category.iconUrl,
        isActive: category.isActive,
        arName:category.arName,
        enName:category.enName
      };
    }
  }

  @action
  async getCategoryById(input: EntityDto) {
    await this.wrapExecutionAsync(async () => {   
      let category =await categoriesService.getCategory(input);
      if (category !== undefined) {
        this.categoryModel = {
          id: category.id,
          type:category.type,
          imageUrl: category.imageUrl,
          iconUrl: category.iconUrl,
          isActive: category.isActive,
          arName:category.arName,
          enName:category.enName
        };
      }
    }, () => {
      this.loadingCategories = true;
    }, () => {
      this.loadingCategories = false;
    });
    
  }


  @action
  async categoryActivation(input: EntityDto) {
    await this.wrapExecutionAsync(async () => {   
      await categoriesService.categoryActivation(input);
      await this.getCategories();
      notifySuccess();
    }, () => {
      this.loadingCategories = true;
    }, () => {
      this.loadingCategories = false;
    });
  }
  @action
  async categoryDeactivation(input: EntityDto) {
    await this.wrapExecutionAsync(async () => {   
      await categoriesService.categoryDeactivation(input);
      await this.getCategories();
      notifySuccess();
    }, () => {
      this.loadingCategories = true;
    }, () => {
      this.loadingCategories = false;
    });
  }

}

export default CategoryStore;
