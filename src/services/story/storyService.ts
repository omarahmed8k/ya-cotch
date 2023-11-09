import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';
// import { EntityDto } from '../dto/entityDto';
// import { LiteEntityDto } from '../dto/liteEntityDto';
import { StoryFilterAndSortedReq } from './dto/storyFilterAndSortedReq';
import CreateStoryDto from './dto/createStoryDto'
import { StoryDto } from './dto/storyDto';

class StoryService {
    public async getAll(input: StoryFilterAndSortedReq): Promise<PagedResultDto<StoryDto>> {
        const result = await http.get('api/services/app/Story/GetAll', {
            params: {
                skipCount: input.skipCount,
                maxResultCount: input.maxResultCount,
                isActive: input.isActive,
                keyword: input.keyword,
            }
        });
        return result.data.result;
    }

  public async createStory(input: CreateStoryDto):Promise<StoryDto> {
    const result = await http.post('/api/services/app/Story/Create', input);
    return result.data;
  }
}
export default new StoryService();
