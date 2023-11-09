import { action, observable } from 'mobx';
import StoreBase from './storeBase';
import { EntityDto } from '../services/dto/entityDto';
import { notifySuccess } from '../lib/notifications';
import { TraineeDto } from '../services/trainees/dto/traineeDto';
import traineesService from '../services/trainees/traineesService';
import { UpdateStatusDto } from '../services/trainees/dto/updateStatusDto';
import { UpdateTraineeDto } from '../services/trainees/dto/updateTraineeDto';

class TraineeStore extends StoreBase {
  @observable trainees: Array<TraineeDto> = [];
  @observable loadingTrainees = false;
  @observable maxResultCount: number = 1000;
  @observable skipCount: number = 0;
  @observable traineeModel?: TraineeDto = undefined;
  @observable totalCount: number = 0;
  @observable keyword?: string = undefined;
  @observable isSubmittingTrainee?: boolean = undefined;
  @observable status?: number = undefined;
  @observable gender?: number = undefined;
 

  @action
  async getTraniees() {
    await this.wrapExecutionAsync(async () => {
      let result = await traineesService.getAll({
          skipCount:this.skipCount,
          maxResultCount:this.maxResultCount,
          keyword:this.keyword,
          gender:this.gender,
          status:this.status
      });
      this.trainees = result.items;
      this.totalCount=result.totalCount;
    }, () => {
      this.loadingTrainees = true;
    }, () => {
      this.loadingTrainees = false;
    });
  }

  @action
  async getTranieeById(input: EntityDto) {
    await this.wrapExecutionAsync(async () => {
      let trainee = await traineesService.getTrainee(input);
      if (trainee !== undefined) {
        this.traineeModel = {
          id: trainee.id,
          gender:trainee.gender,
          address:trainee.address,
          birthDate:trainee.birthDate,
          countryCode:trainee.countryCode,
          emailAddress:trainee.emailAddress,
          name:trainee.name,
          phoneNumber:trainee.phoneNumber,
          age:trainee.age,
          lastLoginDate:trainee.lastLoginDate,
   appliedCourses:trainee.appliedCourses,
   appliedCoursesCount:trainee.appliedCoursesCount,
   bmi:trainee.bmi,
   imageUrl:trainee.imageUrl,
   isActive:trainee.isActive,
   isVerified:trainee.isVerified,
   length:trainee.length,
   weight:trainee.weight,
          status:trainee.status
        };
      }
    }, () => {
      this.loadingTrainees = true;
    }, () => {
      this.loadingTrainees = false;
    });
  }
  
  @action
  async updateStatus(input: UpdateStatusDto) {
    await this.wrapExecutionAsync(async () => {
      await traineesService.updateStatus(input);
      await this.getTraniees();
      notifySuccess();
    }, () => {
      this.isSubmittingTrainee = true;
    }, () => {
      this.isSubmittingTrainee = false;
    });
  }

  @action
  async updateTrainee(input: UpdateTraineeDto) {
    await this.wrapExecutionAsync(async () => {
      await traineesService.updateTrainee(input);
      notifySuccess();
    }, () => {
      this.isSubmittingTrainee = true;
    }, () => {
      this.isSubmittingTrainee = false;
    });
  }


}

export default TraineeStore;
