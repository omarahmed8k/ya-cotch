import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';
import { EntityDto } from '../dto/entityDto';
import { LiteEntityDto } from '../dto/liteEntityDto';
import { ShopsFilterAndSortedRequest } from './dto/shopFilterAndSortedRequest';
import { ShopDto } from './dto/shopDto';
import { CreateShopDto } from './dto/createShopDto';
import { UpdateShopDto } from './dto/updateShopDto';

class ShopsService {

  public async getAll(input: ShopsFilterAndSortedRequest): Promise<PagedResultDto<ShopDto>> {
    let result = await http.get('api/services/app/Shop/GetAll', { 
      params: {skipCount:input.skipCount, maxResultCount:input.maxResultCount,
        isActive:input.isActive,keyword:input.keyword,
        cityId:input.cityId,
        maxRate:input.maxRate,
        minRate:input.minRate,
    } });
    return result.data.result;
  }

  public async getAllLite(input?: ShopsFilterAndSortedRequest): Promise<PagedResultDto<LiteEntityDto>> {
    let result = await http.get('api/services/app/Shop/GetAllLite', { 
      params: {skipCount:input?.skipCount, maxResultCount:input?.maxResultCount,
        isActive:input?.isActive,keyword:input?.keyword,
        cityId:input?.cityId,
        maxRate:input?.maxRate,
        minRate:input?.minRate,
    } });
    return result.data.result;
  }

  public async getShop(input: EntityDto):Promise<ShopDto>  {
    let result = await http.get('api/services/app/Shop/Get', { params: {id:input.id} });
    return result.data.result;
  }

  public async createShop(input: CreateShopDto):Promise<ShopDto> {
    let result = await http.post('api/services/app/Shop/Create', input);
    return result.data;
  }

  public async updateShop(input: UpdateShopDto):Promise<ShopDto> {
    let result = await http.put('api/services/app/Shop/Update', input);
    return result.data;
  }

  public async shopActivation(input: EntityDto) {
    let result = await http.put('api/services/app/Shop/Activate', input);
    return result.data;
  }
  public async shopDeactivation(input: EntityDto) {
    let result = await http.put('api/services/app/Shop/DeActivate', input);
    return result.data;
  }
  
}

export default new ShopsService();
