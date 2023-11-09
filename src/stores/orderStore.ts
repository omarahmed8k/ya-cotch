import { action, observable } from 'mobx';
import StoreBase from './storeBase';
import { EntityDto } from '../services/dto/entityDto';
import { OrderDto } from '../services/orders/dto/orderDto';
import OrderStatus from '../services/types/orderStatus';
import ordersService from '../services/orders/ordersService';

class OrderStore extends StoreBase {
  @observable orders: Array<OrderDto> = [];
  @observable loadingOrders = true;
  
  @observable maxResultCount: number = 1000;
  @observable skipCount: number = 0;
  @observable totalCount: number = 0;
  @observable orderModel?: OrderDto = undefined;
  @observable isActiveFilter?: boolean = undefined;
  @observable keyword?: string = undefined;
  @observable restaurantId?: number = undefined;
  @observable shopId?: number = undefined;
  @observable isFromRestaurants?: boolean = undefined;
  @observable status?: OrderStatus = undefined;


  @action
  async getOrders() {
    await this.wrapExecutionAsync(async () => {
      let result = await ordersService.getAll({
        skipCount: this.skipCount,
        maxResultCount: this.maxResultCount,
        isActive:this.isActiveFilter,
        keyword:this.keyword,
        restaurantId:this.restaurantId,
        shopId:this.shopId,
        isFromRestaurants:this.isFromRestaurants,
        status:this.status
      });

      this.orders = result.items;
      this.totalCount =result.totalCount;
    }, () => {
      this.loadingOrders = true;
    }, () => {
      this.loadingOrders = false;
    });
  }  

  @action
  async getOrder(input: EntityDto) {
   
    await this.wrapExecutionAsync(async () => {
      let order = await ordersService.getOrder(input);
      if (order !== undefined) {
        this.orderModel = {
         actions:order.actions,
         creationTime:order.creationTime,
         id:order.id,
         items:order.items,
         number:order.number,
         paidAmount:order.paidAmount,
         paymentMethod:order.paymentMethod,
         restaurant:order.restaurant,
         restaurantId:order.restaurantId,
         shop:order.shop,
         shopId:order.shopId,
         status:order.status,
         trainee:order.trainee,
         traineeId:order.traineeId,
         transactionId:order.transactionId
        };
      }
    }, () => {
      this.loadingOrders = true;
    }, () => {
      this.loadingOrders = false;
    });
  }
}

export default OrderStore;
