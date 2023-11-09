import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';
import { PaymentsPagedFilterRequest } from './dto/paymentsPagedFilterRequest';
import { PaymentDto } from './dto/paymentDto';

class PaymentsService {

  public async getAll(input: PaymentsPagedFilterRequest): Promise<PagedResultDto<PaymentDto>> {
    let result = await http.get('api/services/app/Payment/GetAll',
      { params: { 
        skipCount: input.skipCount, 
        maxResultCount: input.maxResultCount, 
        isActive: input.isActive, 
        method:input.method,
        keyword: input.keyword,
        courseId:input.courseId,
        trainerId:input.trainerId,
        shopId:input.shopId,
        restaurantId:input.restaurantId} });
    return result.data.result;
  }

}

export default new PaymentsService();
