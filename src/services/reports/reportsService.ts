import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';
import { ReportPagedFilterRequest } from './dto/reportPagedFilterRequest';
import { ReportDto } from './dto/reportDto';

class ReportsService {

  public async getAll(input: ReportPagedFilterRequest): Promise<PagedResultDto<ReportDto>> {
    let result = await http.get('api/services/app/Report/GetAll',
      { params: { 
        skipCount: input.skipCount, 
        maxResultCount: input.maxResultCount, 
        refId: input.refId,
        refType: input.refType,
        keyword:input.keyword
       } });
    return result.data.result;
  }

}

export default new ReportsService();
