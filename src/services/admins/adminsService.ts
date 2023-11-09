import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';
import { EntityDto } from '../dto/entityDto';
import { CreateAdminDto } from './dto/createAdminDto';
import { AdminDto } from './dto/adminDto';
import { UpdateAdminDto } from './dto/updateAdminDto';
import { AdminPagedFilterRequest } from './dto/adminPagedFilterRequest';

class AdminsService {

  public async getAll(input: AdminPagedFilterRequest): Promise<PagedResultDto<AdminDto>> {
    let result = await http.get('api/services/app/Admin/GetAll',
      { params: { skipCount: input.skipCount, maxResultCount: input.maxResultCount, isActive: input.isActive, keyword: input.keyword } });
    return result.data.result;
  }

  public async getAdmin(input: EntityDto): Promise<AdminDto> {
    let result = await http.get('api/services/app/Admin/Get', { params: { id: input.id } });
    return result.data;
  }

  public async createAdmin(input: CreateAdminDto): Promise<AdminDto> {
    let result = await http.post('api/services/app/Admin/Create', input);
    return result.data;
  }

  public async updateAdmin(input: UpdateAdminDto): Promise<AdminDto> {
    let result = await http.put('api/services/app/Admin/Update', input);
    return result.data;
  }

  public async deleteAdmin(input: EntityDto) {
    let result = await http.delete('api/services/app/Admin/Delete', { params: { id: input.id } });
    return result.data;
  }

}

export default new AdminsService();
