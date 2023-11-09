import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';
import { EntityDto } from '../dto/entityDto';
import { ReviewPagedFilterRequest } from './dto/reviewPagedFilterRequest';
import { ReviewDto } from './dto/reviewDto';

class ReviewsService {

  public async getAll(input: ReviewPagedFilterRequest): Promise<PagedResultDto<ReviewDto>> {
    let result = await http.get('api/services/app/Review/GetAll',
      { params: { 
        skipCount: input.skipCount, 
        maxResultCount: input.maxResultCount, 
        isHidden: input.isHidden, 
        refId: input.refId,
        refType: input.refType,
       } });
    return result.data.result;
  }

  public async showReview(input: EntityDto) {
    let result = await http.post('api/services/app/Review/Show', input);
    return result.data;
  }

  public async hideReview(input: EntityDto) {
    let result = await http.post('api/services/app/Review/Hide', input);
    return result.data;
  }


}

export default new ReviewsService();
