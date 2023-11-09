import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';
import { PagedFilterAndSortedRequest } from '../dto/pagedFilterAndSortedRequest';
import { CategoryDto } from './dto/categoryDto';
import { EntityDto } from '../dto/entityDto';
import { CreateCategoryDto } from './dto/createCategoryDto';
import { UpdateCategoryDto } from './dto/updateCategoryDto';
import { LiteEntityDto } from '../dto/liteEntityDto';

class CategoriesService {

  public async getAll(input: PagedFilterAndSortedRequest): Promise<PagedResultDto<CategoryDto>> {
    let result = await http.get('api/services/app/Category/GetAll', { params: {skipCount:input.skipCount, maxResultCount:input.maxResultCount,isActive:input.isActive,keyword:input.keyword,type:input.type} });
    return result.data.result;
  }

  public async getCategory(input: EntityDto):Promise<CategoryDto>  {
    let result = await http.get('api/services/app/Category/Get', { params: {id:input.id} });
    return result.data.result;
  }

  public async createCategory(input: CreateCategoryDto):Promise<CategoryDto> {
    let result = await http.post('api/services/app/Category/Create', input);
    return result.data;
  }
  public async getAllLite(input?: PagedFilterAndSortedRequest): Promise<PagedResultDto<LiteEntityDto>> {
    let result = await http.get('api/services/app/Category/GetAllLite', { params: {
      skipCount:input?.skipCount,
       maxResultCount:input?.maxResultCount
       ,isActive:input?.isActive,
       keyword:input?.keyword,type:input?.type} });
    return result.data.result;
  }

  public async updateCategory(input: UpdateCategoryDto):Promise<CategoryDto> {
    let result = await http.put('api/services/app/Category/Update', input);
    return result.data;
  }

  public async categoryActivation(input: EntityDto) {
    let result = await http.put('api/services/app/Category/Activate', input);
    return result.data;
  }
  public async categoryDeactivation(input: EntityDto) {
    let result = await http.put('api/services/app/Category/DeActivate', input);
    return result.data;
  }
  
}

export default new CategoriesService();
