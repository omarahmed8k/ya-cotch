import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';
import { EntityDto } from '../dto/entityDto';
import { RestaurantsFilterAndSortedRequest } from './dto/restaurantFilterAndSortedRequest';
import { RestaurantDto } from './dto/restaurantDto';
import { LiteEntityDto } from '../dto/liteEntityDto';
import { CreateRestaurantDto } from './dto/createRestaurantDto';
import { UpdateRestaurantDto } from './dto/updateRestaurantDto';

class RestaurantsService {

  public async getAll(input: RestaurantsFilterAndSortedRequest): Promise<PagedResultDto<RestaurantDto>> {
    let result = await http.get('api/services/app/Restaurant/GetAll', { 
      params: {skipCount:input.skipCount, maxResultCount:input.maxResultCount,
        isActive:input.isActive,keyword:input.keyword,
        cityId:input.cityId,
        maxRate:input.maxRate,
        minRate:input.minRate,
    } });
    return result.data.result;
  }

  public async getAllLite(input?: RestaurantsFilterAndSortedRequest): Promise<PagedResultDto<LiteEntityDto>> {
    let result = await http.get('api/services/app/Restaurant/GetAllLite', { 
      params: {skipCount:input?.skipCount, maxResultCount:input?.maxResultCount,
        isActive:input?.isActive,keyword:input?.keyword,
        cityId:input?.cityId,
        maxRate:input?.maxRate,
        minRate:input?.minRate,
    } });
    return result.data.result;
  }

  public async getRestaurant(input: EntityDto):Promise<RestaurantDto>  {
    let result = await http.get('api/services/app/Restaurant/Get', { params: {id:input.id} });
    return result.data.result;
  }

  public async createRestaurant(input: CreateRestaurantDto):Promise<RestaurantDto> {
    let result = await http.post('api/services/app/Restaurant/Create', input);
    return result.data;
  }

  public async updateRestaurant(input: UpdateRestaurantDto):Promise<RestaurantDto> {
    let result = await http.put('api/services/app/Restaurant/Update', input);
    return result.data;
  }

  public async restaurantActivation(input: EntityDto) {
    let result = await http.put('api/services/app/Restaurant/Activate', input);
    return result.data;
  }
  public async restaurantDeactivation(input: EntityDto) {
    let result = await http.put('api/services/app/Restaurant/DeActivate', input);
    return result.data;
  }
  
}

export default new RestaurantsService();
