import { action, observable } from 'mobx';
import StoreBase from './storeBase';
// import { EntityDto } from '../services/dto/entityDto';
import { notifySuccess } from '../lib/notifications';
import { StoryDto } from '../services/story/dto/storyDto';
import CreateStoryDto from '../services/story/dto/createStoryDto'
import StoryService from '../services/story/storyService';

class StoryStore extends StoreBase {
    @observable stories: Array<StoryDto> = [];

    @observable loadingStories = true;

    @observable isSubmittingStory = false;

    @observable maxResultCount = 1000;

    @observable skipCount = 0;

    @observable storyModel?: StoryDto = undefined;

    @observable totalCount = 0;

    @observable isActiveFilter?: boolean = undefined;

    @observable keyword?: string = undefined;

    @action
    async getStories() {
        await this.wrapExecutionAsync(async () => {
            const result = await StoryService.getAll({
                skipCount: this.skipCount,
                maxResultCount: this.maxResultCount,
                isActive: this.isActiveFilter,
                keyword: this.keyword,
            });
            this.stories = result.items;
            this.totalCount = result.totalCount;
        }, () => {
            this.loadingStories = true;
        }, () => {
            this.loadingStories = false;
        });
    }

   @action
  async createStory(input: CreateStoryDto) {
    await this.wrapExecutionAsync(async () => {
      await StoryService.createStory(input);
      await this.getStories();
      notifySuccess();
    }, () => {
      this.isSubmittingStory = true;
    }, () => {
      this.isSubmittingStory = false;
    });
  }
}

export default StoryStore;
