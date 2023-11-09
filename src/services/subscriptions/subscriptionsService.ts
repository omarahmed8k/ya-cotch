import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';
import { EntityDto } from '../dto/entityDto';
import { LiteEntityDto } from '../dto/liteEntityDto';
import { SubscriptionsFilterAndSortedRequest } from './dto/subscripyionFilterAndSortedRequest';
import { SubscriptionDto } from './dto/subscriptionDto';
import { UpdateSubscriptionDto } from './dto/updateSubscriptionDto';
import { CreateSubscriptionDto } from './dto/createSubscriptionDto';
import { AssignSubscriptionToUserDto } from './dto/assignSubscriptionToUserDto';

class SubscriptionService {

  public async getAll(input: SubscriptionsFilterAndSortedRequest): Promise<PagedResultDto<SubscriptionDto>> {
    let result = await http.get('api/services/app/Subscription/GetAll', { 
      params: {skipCount:input.skipCount, maxResultCount:input.maxResultCount,
        isActive:input.isActive,keyword:input.keyword,
       
    } });
    return result.data.result;
  }

  public async getAllLite(input?: SubscriptionsFilterAndSortedRequest): Promise<PagedResultDto<LiteEntityDto>> {
    let result = await http.get('api/services/app/Subscription/GetAllLite', { 
      params: {skipCount:input?.skipCount, maxResultCount:input?.maxResultCount,
        isActive:input?.isActive,keyword:input?.keyword,target:input?.target
    } });
    return result.data.result;
  }

  public async getSubscription(input: EntityDto):Promise<SubscriptionDto>  {
    let result = await http.get('api/services/app/Subscription/Get', { params: {id:input.id} });
    return result.data.result;
  }

  public async createSubscription(input: CreateSubscriptionDto):Promise<SubscriptionDto> {
    let result = await http.post('api/services/app/Subscription/Create', input);
    return result.data;
  }

  public async assignSubscriptionToUser(input: AssignSubscriptionToUserDto) {
    let result = await http.post('api/services/app/Subscription/AssignSubscriptionToUser', input);
    return result.data;
  }

  public async updateSubscription(input: UpdateSubscriptionDto):Promise<SubscriptionDto> {
    let result = await http.put('api/services/app/Subscription/Update', input);
    return result.data;
  }

  public async subscriptionActivation(input: EntityDto) {
    let result = await http.put('api/services/app/Subscription/Activate', input);
    return result.data;
  }
  public async subscriptionDeactivation(input: EntityDto) {
    let result = await http.put('api/services/app/Subscription/DeActivate', input);
    return result.data;
  }
  
}

export default new SubscriptionService();
