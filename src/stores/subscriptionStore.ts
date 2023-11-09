import { action, observable } from 'mobx';
import StoreBase from './storeBase';
import { EntityDto } from '../services/dto/entityDto';
import { notifySuccess } from '../lib/notifications';
import { SubscriptionDto } from '../services/subscriptions/dto/subscriptionDto';
import subscriptionsService from '../services/subscriptions/subscriptionsService';
import { CreateSubscriptionDto } from '../services/subscriptions/dto/createSubscriptionDto';
import { UpdateSubscriptionDto } from '../services/subscriptions/dto/updateSubscriptionDto';
import { AssignSubscriptionToUserDto } from '../services/subscriptions/dto/assignSubscriptionToUserDto';

class SubscriptionStore extends StoreBase {
  @observable subscriptions: Array<SubscriptionDto> = [];
  @observable loadingSubscriptions = true;
  @observable isSubmittingSubscription = false;
  @observable maxResultCount: number = 1000;
  @observable skipCount: number = 0;
  @observable subscriptionModel?: SubscriptionDto = undefined;
  
  @observable totalCount: number = 0;
  @observable isActiveFilter?: boolean = undefined;
  @observable keyword?: string = undefined;

  @action
  async getSubscriptions() {
    await this.wrapExecutionAsync(async () => {
      let result = await subscriptionsService.getAll({
          skipCount:this.skipCount,
          maxResultCount:this.maxResultCount,
          isActive:this.isActiveFilter,
          keyword:this.keyword,
      });
      this.subscriptions = result.items;
      this.totalCount=result.totalCount;
    }, () => {
      this.loadingSubscriptions = true;
    }, () => {
      this.loadingSubscriptions = false;
    });
  }

  @action
  async createSubscription(input: CreateSubscriptionDto) {
    await this.wrapExecutionAsync(async () => {
      await subscriptionsService.createSubscription(input);
      await this.getSubscriptions();
      notifySuccess();
    }, () => {
      this.isSubmittingSubscription = true;
    }, () => {
      this.isSubmittingSubscription = false;
    });
  }

  @action
  async updateSubscription(input: UpdateSubscriptionDto) {
    await this.wrapExecutionAsync(async () => {
      await subscriptionsService.updateSubscription(input);
      await this.getSubscriptions();
      notifySuccess();
    }, () => {
      this.isSubmittingSubscription = true;
    }, () => {
      this.isSubmittingSubscription = false;
    });
  }

  @action
  async getSubscription(input: EntityDto) {
    await this.wrapExecutionAsync(async () => {
      let subscription = await subscriptionsService.getSubscription(input);
      if (subscription !== undefined) {
        this.subscriptionModel = {
          colorCode:subscription.colorCode,
          creationTime:subscription.creationTime,
          duration:subscription.duration,
          fee:subscription.fee,
          id:subscription.id,
          isActive:subscription.isActive,
          itemsCount:subscription.itemsCount,
          name:subscription.name,
          priceFrom:subscription.priceFrom,
          priceTo:subscription.priceTo,
          requestsCount:subscription.requestsCount,
          target:subscription.target,
          usedSubscriptions:subscription.usedSubscriptions
        };
      }
    }, () => {
      this.loadingSubscriptions = true;
    }, () => {
      this.loadingSubscriptions = false;
    });
  }


  @action
  async subscriptionActivation(input: EntityDto) {
    await this.wrapExecutionAsync(async () => {   
      await subscriptionsService.subscriptionActivation(input);
      notifySuccess();
    }, () => {
      this.loadingSubscriptions = true;
    }, () => {
      this.loadingSubscriptions = false;
    });
  }
  @action
  async subscriptionDeactivation(input: EntityDto) {
    await this.wrapExecutionAsync(async () => {   
      await subscriptionsService.subscriptionDeactivation(input);
      notifySuccess();
    }, () => {
      this.loadingSubscriptions = true;
    }, () => {
      this.loadingSubscriptions = false;
    });
  }

  @action
  async assignSubscriptionToUser(input: AssignSubscriptionToUserDto) {
    await this.wrapExecutionAsync(async () => {   
      await subscriptionsService.assignSubscriptionToUser(input);
      notifySuccess();
      await this.getSubscriptions();
    }, () => {
      this.isSubmittingSubscription = true;
    }, () => {
      this.isSubmittingSubscription = false;
    });
  }

}

export default SubscriptionStore;
