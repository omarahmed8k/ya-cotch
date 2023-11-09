import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';
import { EntityDto } from '../dto/entityDto';
import { LocationDto } from './dto/locationDto';
import { CreateLocationDto } from './dto/createLocationDto';
import { UpdateLocationDto } from './dto/updateLocationDto';
import { LocationPagedFilterRequest } from './dto/locationPagedFilterRequest';
import { LiteEntityDto } from '../dto/liteEntityDto';

class LocationsService {

  public async getAll(input?: LocationPagedFilterRequest): Promise<PagedResultDto<LocationDto>> {
    let result = await http.get('api/services/app/Location/GetAll',
      { params: { skipCount: input?.skipCount, maxResultCount: input?.maxResultCount, type: input?.type, parentId:input?.parentId,isActive:input?.isActive,keyword:input?.keyword } });
    return result.data.result;
  }

  public async getAllLite(input: LocationPagedFilterRequest): Promise<PagedResultDto<LiteEntityDto>> {
    let result = await http.get('api/services/app/Location/GetAllLite',
      { params: { type: input.type } });
    return result.data.result;
  }

  public async getLocation(input: EntityDto): Promise<LocationDto> {
    let result = await http.get('api/services/app/Location/Get', { params: { id: input.id } });
    return result.data;
  }

  public async createLocation(input: CreateLocationDto): Promise<LocationDto> {
    let result = await http.post('api/services/app/Location/Create', input);
    return result.data;
  }

  public async updateLocation(input: UpdateLocationDto): Promise<LocationDto> {
    let result = await http.put('api/services/app/Location/Update', input);
    return result.data;
  }

  public async locationActivation(input: EntityDto) {
    let result = await http.put('api/services/app/Location/Activate', input);
    return result.data;
  }
  public async locationDeactivation(input: EntityDto) {
    let result = await http.put('api/services/app/Location/DeActivate', input);
    return result.data;
  }
}

export default new LocationsService();
