import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';
import { PagedFilterAndSortedRequest } from '../dto/pagedFilterAndSortedRequest';
import { EntityDto } from '../dto/entityDto';
import { TrainerDto } from './dto/trainerDto';
import { UpdateStatusDto } from './dto/updateStatusDto';
import { UpdateTrainerDto } from './dto/updateTrainerDto';
import { LiteEntityDto } from '../dto/liteEntityDto';

class TrainersService {

  public async getAll(input: PagedFilterAndSortedRequest): Promise<PagedResultDto<TrainerDto>> {
    let result = await http.get('api/services/app/Trainer/GetAll',
     { params: {
       skipCount:input.skipCount, 
       maxResultCount:input.maxResultCount,
       isVerified:input.isVerified,
       keyword:input.keyword,
       specializationId:input.specializationId,
       status:input.status
      } });
    return result.data.result;
  }

  public async getTrainer(input: EntityDto):Promise<TrainerDto>  {
    let result = await http.get('api/services/app/Trainer/Get', { params: {id:input.id} });
    return result.data.result;
  }
 
  public async getAllLite(): Promise<PagedResultDto<LiteEntityDto>> {
    let result = await http.get('api/services/app/Trainer/GetAllLite');
    return result.data.result;
  }

  public async updateStatus(input: UpdateStatusDto){
    let result = await http.put('api/services/app/Trainer/UpdateStatus', input);
    return result.data;
  }
  
  public async updateTrainer(input: UpdateTrainerDto){
    let result = await http.put('api/services/app/Trainer/Update', input);
    return result.data;
  }

}

export default new TrainersService();
