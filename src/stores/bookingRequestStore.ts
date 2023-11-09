import { action, observable } from 'mobx';
import StoreBase from './storeBase';
import { EntityDto } from '../services/dto/entityDto';
import { BookingRequestsDto } from '../services/bookingRequests/dto/bookingRequestsDto';
import bookingRequestsService from '../services/bookingRequests/bookingRequestsService';
import BookingRequestStatus from '../services/types/bookingRequestStatus';

class BookingRequestStore extends StoreBase {
  @observable bookingRequests: Array<BookingRequestsDto> = [];
  @observable loadingBookingRequests = true;
  
  @observable isSubmittingBookingRequest = false;

  @observable maxResultCount: number = 1000;
  @observable skipCount: number = 0;
  @observable totalCount: number = 0;
  @observable bookingRequestModel?: BookingRequestsDto = undefined;
  @observable isActiveFilter?: boolean = undefined;
  @observable keyword?: string = undefined;
  @observable courseId?: number = undefined;
  @observable status?: BookingRequestStatus = undefined;


  @action
  async getBookingRequests() {
    await this.wrapExecutionAsync(async () => {
      let result = await bookingRequestsService.getAll({
        skipCount: this.skipCount,
        maxResultCount: this.maxResultCount,
        isActive:this.isActiveFilter,
        keyword:this.keyword,
        courseId:this.courseId,
        status:this.status
      });

      this.bookingRequests = result.items;
      this.totalCount =result.totalCount;
    }, () => {
      this.loadingBookingRequests = true;
    }, () => {
      this.loadingBookingRequests = false;
    });
  }  

  @action
  async getBookingRequest(input: EntityDto) {
   
    await this.wrapExecutionAsync(async () => {
      let bookingRequest = await bookingRequestsService.getBookingRequest(input);
      if (bookingRequest !== undefined) {
        this.bookingRequestModel = {
          id: bookingRequest.id,
          actions:bookingRequest.actions,
          course:bookingRequest.course,
          courseId:bookingRequest.courseId,
          creationTime:bookingRequest.creationTime,
          paidAmount:bookingRequest.paidAmount,
          paymentMethod:bookingRequest.paymentMethod,
          status:bookingRequest.status,
          trainee:bookingRequest.trainee,
          traineeId:bookingRequest.traineeId,
          transactionId:bookingRequest.transactionId
        };
      }
    }, () => {
      this.loadingBookingRequests = true;
    }, () => {
      this.loadingBookingRequests = false;
    });
  }
}

export default BookingRequestStore;
