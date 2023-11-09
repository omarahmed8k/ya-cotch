import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';
import { EntityDto } from '../dto/entityDto';
import { DishesFilterAndSortedRequest } from './dto/dishFilterAndSortedRequest';
import { DishDto } from './dto/dishDto';
import { CreateDishDto } from './dto/createDishDto';
import { UpdateDishDto } from './dto/updateDishDto';

class DishesService {

  public async getAll(input: DishesFilterAndSortedRequest): Promise<PagedResultDto<DishDto>> {
    let result = await http.get('api/services/app/Dish/GetAll', { 
      params: {skipCount:input.skipCount, maxResultCount:input.maxResultCount,
        isActive:input.isActive,keyword:input.keyword,
      categoryId:input.categoryId,
      restaurantId:input.restaurantId,
      minPrice:input.minPrice,
      maxPrice:input.maxPrice } });
    return result.data.result;
  }

  public async getDish(input: EntityDto):Promise<DishDto>  {
    let result = await http.get('api/services/app/Dish/Get', { params: {id:input.id} });
    return result.data.result;
  }

  public async createDish(input: CreateDishDto):Promise<DishDto> {
    let result = await http.post('api/services/app/Dish/Create', input);
    return result.data;
  }

  public async updateDish(input: UpdateDishDto):Promise<DishDto> {
    let result = await http.put('api/services/app/Dish/Update', input);
    return result.data;
  }

  public async dishActivation(input: EntityDto) {
    let result = await http.put('api/services/app/Dish/Activate', input);
    return result.data;
  }
  public async dishDeactivation(input: EntityDto) {
    let result = await http.put('api/services/app/Dish/DeActivate', input);
    return result.data;
  }
  
}

export default new DishesService();
