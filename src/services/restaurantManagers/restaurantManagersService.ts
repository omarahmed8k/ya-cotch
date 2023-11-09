import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';
import { AdminPagedFilterRequest } from '../admins/dto/adminPagedFilterRequest';
import { RestaurantManagerDto } from './dto/restaurantManagerDto';
import { EntityDto } from '../dto/entityDto';
import { UpdateRestaurantManagerDto } from './dto/updateRestaurantManagerDto';

class RestaurantManagersService {

  public async getAll(input: AdminPagedFilterRequest): Promise<PagedResultDto<RestaurantManagerDto>> {
    let result = await http.get('api/services/app/RestaurantManager/GetAll',
      { params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount, isActive: input.isActive, keyword: input.keyword } });
    return result.data.result;
  }

  public async getRestaurantManager(input: EntityDto):Promise<RestaurantManagerDto>  {
    let result = await http.get('api/services/app/RestaurantManager/Get', { params: {id:input.id} });
    return result.data.result;
  }

  public async restaurantManagerUpdate(input: UpdateRestaurantManagerDto) {
    let result = await http.put('api/services/app/RestaurantManager/Update', input);
    return result.data;
  }

  public async restaurantManagerActivation(input: EntityDto) {
    let result = await http.put('api/services/app/RestaurantManager/Activate', input);
    return result.data;
  }
  public async restaurantManagerDeactivation(input: EntityDto) {
    let result = await http.put('api/services/app/RestaurantManager/DeActivate', input);
    return result.data;
  }
}

export default new RestaurantManagersService();
