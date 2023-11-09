import { action, observable } from 'mobx';
import StoreBase from './storeBase';
import { EntityDto } from '../services/dto/entityDto';
import { notifySuccess } from '../lib/notifications';
import { ProductDto } from '../services/products/dto/productDto';
import productsService from '../services/products/productsService';
import { CreateProductDto } from '../services/products/dto/createProductDto';
import { UpdateProductDto } from '../services/products/dto/updateProductDto';

class ProductStore extends StoreBase {
  @observable products: Array<ProductDto> = [];
  @observable loadingProducts = true;
  @observable isSubmittingProduct = false;
  @observable maxResultCount: number = 1000;
  @observable skipCount: number = 0;
  @observable productModel?: ProductDto = undefined;
  
  @observable totalCount: number = 0;
  @observable isActiveFilter?: boolean = undefined;
  @observable keyword?: string = undefined;
  @observable categoryId?: number = undefined;
  @observable shopId?: number = undefined;
  @observable maxPrice?: number = undefined;
  @observable minPrice?: number = undefined;

  @action
  async getProducts() {
    await this.wrapExecutionAsync(async () => {
      let result = await productsService.getAll({
          skipCount:this.skipCount,
          maxResultCount:this.maxResultCount,
          isActive:this.isActiveFilter,
          keyword:this.keyword,
          categoryId:this.categoryId,
          maxPrice:this.maxPrice,
          minPrice:this.minPrice,
          shopId:this.shopId
      });
      this.products = result.items;
      this.totalCount=result.totalCount;
    }, () => {
      this.loadingProducts = true;
    }, () => {
      this.loadingProducts = false;
    });
  }

  @action
  async createProduct(input: CreateProductDto) {
    await this.wrapExecutionAsync(async () => {
      await productsService.createProduct(input);
      await this.getProducts();
      notifySuccess();
    }, () => {
      this.isSubmittingProduct = true;
    }, () => {
      this.isSubmittingProduct = false;
    });
  }

  @action
  async updateProduct(input: UpdateProductDto) {
    await this.wrapExecutionAsync(async () => {
      await productsService.updateProduct(input);
      await this.getProducts();
      notifySuccess();
    }, () => {
      this.isSubmittingProduct = true;
    }, () => {
      this.isSubmittingProduct = false;
    });
  }


  @action
  async getProduct(input: EntityDto) {
    await this.wrapExecutionAsync(async () => {
      let dish = await productsService.getProduct(input);
      if (dish !== undefined) {
        this.productModel = {
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
          shop:dish.shop,
          shopId:dish.shopId
        };
      }
    }, () => {
      this.loadingProducts = true;
    }, () => {
      this.loadingProducts = false;
    });
  }


  @action
  async productActivation(input: EntityDto) {
    await this.wrapExecutionAsync(async () => {   
      await productsService.productActivation(input);
      await this.getProducts();
      notifySuccess();
    }, () => {
      this.loadingProducts = true;
    }, () => {
      this.loadingProducts = false;
    });
  }
  @action
  async productDeactivation(input: EntityDto) {
    await this.wrapExecutionAsync(async () => {   
      await productsService.productDeactivation(input);
      await this.getProducts();
      notifySuccess();
    }, () => {
      this.loadingProducts = true;
    }, () => {
      this.loadingProducts = false;
    });
  }

}

export default ProductStore;
