import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';
import { PagedFilterAndSortedRequest } from '../dto/pagedFilterAndSortedRequest';
import { EntityDto } from '../dto/entityDto';
import { UpdateStatusDto } from './dto/updateStatusDto';
import { UpdateTraineeDto } from './dto/updateTraineeDto';
import { TraineeDto } from './dto/traineeDto';

class TraineesService {

  public async getAll(input: PagedFilterAndSortedRequest): Promise<PagedResultDto<TraineeDto>> {
    let result = await http.get('api/services/app/Trainee/GetAll',
     { params: {
       skipCount:input.skipCount, 
       maxResultCount:input.maxResultCount,
       keyword:input.keyword,
       status:input.status,
       gender:input.gender
      } });
    return result.data.result;
  }

  public async getTrainee(input: EntityDto):Promise<TraineeDto>  {
    let result = await http.get('api/services/app/Trainee/Get', { params: {id:input.id} });
    return result.data.result;
  }
 
  public async updateStatus(input: UpdateStatusDto){
    let result = await http.put('api/services/app/Trainee/UpdateStatus', input);
    return result.data;
  }
  
  public async updateTrainee(input: UpdateTraineeDto){
    let result = await http.put('api/services/app/Trainee/Update', input);
    return result.data;
  }

}

export default new TraineesService();
