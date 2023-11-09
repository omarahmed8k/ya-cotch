import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';
import { EntityDto } from '../dto/entityDto';
import { IndexPagedFilterRequest } from './dto/indexPagedFilterRequest';
import { IndexDto } from './dto/IndexDto';
import { CreateIndexDto } from './dto/createIndexDto';
import { UpdateIndexDto } from './dto/updateIndexDto';
import { LiteEntityDto } from '../dto/liteEntityDto';

class IndexesService {

  public async getAll(input?: IndexPagedFilterRequest): Promise<PagedResultDto<IndexDto>> {
    let result = await http.get('api/services/app/Index/GetAll',
      { params: { skipCount: input?.skipCount, maxResultCount: input?.maxResultCount, type: input?.type,isActive:input?.isActive,keyword:input?.keyword } });
    return result.data.result;
  }

  public async getAllLite(input: IndexPagedFilterRequest): Promise<PagedResultDto<LiteEntityDto>> {
    let result = await http.get('api/services/app/Index/GetAllLite',
      { params: { type: input.type } });
    return result.data.result;
  }

  public async getIndex(input: EntityDto): Promise<IndexDto> {
    let result = await http.get('api/services/app/Index/Get', { params: { id: input.id } });
    return result.data;
  }

  public async createIndex(input: CreateIndexDto): Promise<IndexDto> {
    let result = await http.post('api/services/app/Index/Create', input);
    return result.data;
  }

  public async updateIndex(input: UpdateIndexDto): Promise<IndexDto> {
    let result = await http.put('api/services/app/Index/Update', input);
    return result.data;
  }

  public async indexActivation(input: EntityDto) {
    let result = await http.put('api/services/app/Index/Activate', input);
    return result.data;
  }
  public async indexDeactivation(input: EntityDto) {
    let result = await http.put('api/services/app/Index/DeActivate', input);
    return result.data;
  }
}

export default new IndexesService();
