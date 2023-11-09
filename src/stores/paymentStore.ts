import { action, observable } from 'mobx';
import StoreBase from './storeBase';
import { PaymentDto } from '../services/payments/dto/paymentDto';
import PaymentMethod from '../services/types/paymentMethod';
import paymentsService from '../services/payments/paymentsService';

class PaymentStore extends StoreBase {
  @observable payments: Array<PaymentDto> = [];
  @observable loadingPayments = true;
  
  @observable maxResultCount: number = 1000;
  @observable skipCount: number = 0;
  @observable totalCount: number = 0;
  @observable isActiveFilter?: boolean = undefined;
  @observable keyword?: string = undefined;
  @observable method?: PaymentMethod = undefined;


  @action
  async getPayments() {
    await this.wrapExecutionAsync(async () => {
      let result = await paymentsService.getAll({
        skipCount: this.skipCount,
        maxResultCount: this.maxResultCount,
        isActive:this.isActiveFilter,
        keyword:this.keyword,
        method:this.method
      });

      this.payments = result.items;
      this.totalCount =result.totalCount;
    }, () => {
      this.loadingPayments = true;
    }, () => {
      this.loadingPayments = false;
    });
  }  

}

export default PaymentStore;
