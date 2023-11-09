import { action, observable } from 'mobx';
import StoreBase from './storeBase';
import { EntityDto } from '../services/dto/entityDto';
import { notifySuccess } from '../lib/notifications';
import { IndexDto } from '../services/indexes/dto/IndexDto';
import indexesService from '../services/indexes/indexesService';
import { CreateIndexDto } from '../services/indexes/dto/createIndexDto';
import { UpdateIndexDto } from '../services/indexes/dto/updateIndexDto';
import IndexType from '../services/types/indexType';

class IndexStore extends StoreBase {
  @observable specializations: Array<IndexDto> = [];
  @observable loadingIndexes = true;
  @observable isSubmittingIndexes = false;
  @observable maxResultCount: number = 1000;
  @observable skipCount: number = 0;
  @observable totalSpecializationCount: number = 0;
  @observable indexModel?: IndexDto = undefined;
  @observable isActiveFilter?: boolean = undefined;
  @observable keyword?: string = undefined;

  @action
  async getSpecializations() {
    await this.wrapExecutionAsync(async () => {
      let result = await indexesService.getAll({
        skipCount: this.skipCount,
        maxResultCount: this.maxResultCount,
        keyword:this.keyword,
        type:IndexType.Specialization,
        isActive:this.isActiveFilter
      });
      this.specializations = result.items;
      this.totalSpecializationCount =result.totalCount;
    }, () => {
      this.loadingIndexes = true;
    }, () => {
      this.loadingIndexes = false;
    });
  }

  @action
  async createIndex(input: CreateIndexDto) {
    await this.wrapExecutionAsync(async () => {
      await indexesService.createIndex(input);
      notifySuccess();
    }, () => {
      this.isSubmittingIndexes = true;
    }, () => {
      this.isSubmittingIndexes = false;
    });
  }

  @action
  async updateIndex(input: UpdateIndexDto) {
    await this.wrapExecutionAsync(async () => {
      await indexesService.updateIndex(input);
      notifySuccess();
    }, () => {
      this.isSubmittingIndexes = true;
    }, () => {
      this.isSubmittingIndexes = false;
    });
  }

  @action
  async getSpecialization(input: EntityDto) {
    let specialization = this.specializations.find(c => c.id === input.id);
    if (specialization !== undefined) {
      this.indexModel = {
        id: specialization.id,
        name: specialization.name,
        isActive: specialization.isActive,
        arName:specialization.arName,
        enName:specialization.enName,
        type:specialization.type
      };
    }
  }

  @action
  async indexActivation(input: EntityDto) {
    await this.wrapExecutionAsync(async () => {   
      await indexesService.indexActivation(input);
      notifySuccess();
    }, () => {
      this.loadingIndexes = true;
    }, () => {
      this.loadingIndexes = false;
    });
  }
  @action
  async indexDeactivation(input: EntityDto) {
    await this.wrapExecutionAsync(async () => {   
      await indexesService.indexDeactivation(input);
      notifySuccess();
    }, () => {
      this.loadingIndexes = true;
    }, () => {
      this.loadingIndexes = false;
    });
  }
}

export default IndexStore;
