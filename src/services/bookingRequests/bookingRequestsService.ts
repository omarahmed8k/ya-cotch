import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';
import { EntityDto } from '../dto/entityDto';
import { BookingRequestsDto } from './dto/bookingRequestsDto';
import { BookingRequestsPagedFilterRequest } from './dto/bookingRequestsPagedFilterRequest';

class BookingRequestsService {

  public async getAll(input: BookingRequestsPagedFilterRequest): Promise<PagedResultDto<BookingRequestsDto>> {
    let result = await http.get('api/services/app/BookingRequest/GetAll',
      { params: { 
        skipCount: input.skipCount, 
        maxResultCount: input.maxResultCount, 
        isActive: input.isActive, 
        courseId:input.courseId,
        status:input.status,
        keyword: input.keyword } });
    return result.data.result;
  }

  public async getBookingRequest(input: EntityDto):Promise<BookingRequestsDto>  {
    let result = await http.get('api/services/app/BookingRequest/Get', { params: {id:input.id} });
    return result.data.result;
  }

}

export default new BookingRequestsService();
