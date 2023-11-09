import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';
import { AdminPagedFilterRequest } from '../admins/dto/adminPagedFilterRequest';
import { EntityDto } from '../dto/entityDto';
import { ShopManagerDto } from './dto/shopManagerDto';
import { UpdateShopManagerDto } from './dto/updateShopManagerDto';

class ShopManagersService {

  public async getAll(input: AdminPagedFilterRequest): Promise<PagedResultDto<ShopManagerDto>> {
    let result = await http.get('api/services/app/ShopManager/GetAll',
      { params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount, isActive: input.isActive, keyword: input.keyword } });
    return result.data.result;
  }

  public async getShopManager(input: EntityDto):Promise<ShopManagerDto>  {
    let result = await http.get('api/services/app/ShopManager/Get', { params: {id:input.id} });
    return result.data.result;
  }

  public async shopManagerUpdate(input: UpdateShopManagerDto) {
    let result = await http.put('api/services/app/ShopManager/Update', input);
    return result.data;
  }

  public async shopManagerActivation(input: EntityDto) {
    let result = await http.put('api/services/app/ShopManager/Activate', input);
    return result.data;
  }
  public async shopManagerDeactivation(input: EntityDto) {
    let result = await http.put('api/services/app/ShopManager/DeActivate', input);
    return result.data;
  }
}

export default new ShopManagersService();
