import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';
import { EntityDto } from '../dto/entityDto';
import { OrderDto } from './dto/orderDto';
import { OrdersPagedFilterRequest } from './dto/ordersPagedFilterRequest';

class OrdersService {

  public async getAll(input: OrdersPagedFilterRequest): Promise<PagedResultDto<OrderDto>> {
    let result = await http.get('api/services/app/Order/GetAll',
      { params: { 
        skipCount: input.skipCount, 
        maxResultCount: input.maxResultCount, 
        isActive: input.isActive, 
        restaurantId:input.restaurantId,
        shopId:input.shopId,
        status:input.status,
        isFromRestaurants:input.isFromRestaurants,
        keyword: input.keyword } });
    return result.data.result;
  }

  public async getOrder(input: EntityDto):Promise<OrderDto>  {
    let result = await http.get('api/services/app/Order/Get', { params: {id:input.id} });
    return result.data.result;
  }

}

export default new OrdersService();
