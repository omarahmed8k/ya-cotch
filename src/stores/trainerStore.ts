import { action, observable } from 'mobx';
import StoreBase from './storeBase';
import { EntityDto } from '../services/dto/entityDto';
import { TrainerDto } from '../services/trainers/dto/trainerDto';
import trainersService from '../services/trainers/trainersService';
import { notifySuccess } from '../lib/notifications';
import userService from '../services/user/userService';
import { UpdateStatusDto } from '../services/trainers/dto/updateStatusDto';
import { UpdateTrainerDto } from '../services/trainers/dto/updateTrainerDto';

class TrainerStore extends StoreBase {
  @observable trainers: Array<TrainerDto> = [];
  @observable loadingTrainers = false;
  @observable maxResultCount: number = 1000;
  @observable skipCount: number = 0;
  @observable trainerModel?: TrainerDto = undefined;
  @observable totalCount: number = 0;
  @observable isVerified?: boolean = undefined;
  @observable keyword?: string = undefined;
  @observable isSubmittingTrainer?: boolean = undefined;
  @observable specializationId?: number = undefined;
  @observable status?: number = undefined;


  @action
  async getTraniers() {
    await this.wrapExecutionAsync(async () => {
      let result = await trainersService.getAll({
          skipCount:this.skipCount,
          maxResultCount:this.maxResultCount,
          keyword:this.keyword,
          isVerified:this.isVerified,
          specializationId:this.specializationId,
          status:this.status
      });
      this.trainers = result.items;
      this.totalCount=result.totalCount;
    }, () => {
      this.loadingTrainers = true;
    }, () => {
      this.loadingTrainers = false;
    });
  }

  @action
  async getTranierById(input: EntityDto) {
    await this.wrapExecutionAsync(async () => {
      let trainer = await trainersService.getTrainer(input);
      if (trainer !== undefined) {
        this.trainerModel = {
          id: trainer.id,
          gender:trainer.gender,
          address:trainer.address,
          birthDate:trainer.birthDate,
          isActive:trainer.isActive,
          countryCode:trainer.countryCode,
          emailAddress:trainer.emailAddress,
          name:trainer.name,
          phoneNumber:trainer.phoneNumber,
          specialization:trainer.specialization,
          specializationId:trainer.specializationId,
          yearsOfExperience:trainer.yearsOfExperience,
          age:trainer.age,
          coursesCount:trainer.coursesCount,
          cvUrl:trainer.cvUrl,
          imageUrl:trainer.imageUrl,
          isVerified:trainer.isVerified,
          lastLoginDate:trainer.lastLoginDate,
          rate:trainer.rate,
          status:trainer.status
        };
      }
    }, () => {
      this.loadingTrainers = true;
    }, () => {
      this.loadingTrainers = false;
    });
  }
  
  @action
  async updateStatus(input: UpdateStatusDto) {
    await this.wrapExecutionAsync(async () => {
      await trainersService.updateStatus(input);
      await this.getTraniers();
      notifySuccess();
    }, () => {
      this.isSubmittingTrainer = true;
    }, () => {
      this.isSubmittingTrainer = false;
    });
  }

  @action
  async updateTrainer(input: UpdateTrainerDto) {
    await this.wrapExecutionAsync(async () => {
      await trainersService.updateTrainer(input);
      notifySuccess();
    }, () => {
      this.isSubmittingTrainer = true;
    }, () => {
      this.isSubmittingTrainer = false;
    });
  }

  @action
  async trainerActivation(input: EntityDto) {
    await this.wrapExecutionAsync(async () => {   
      await userService.userActivation(input);
      await this.getTraniers();
      notifySuccess();
    }, () => {
      this.loadingTrainers = true;
    }, () => {
      this.loadingTrainers = false;
    });
  }
  @action
  async trainerDeactivation(input: EntityDto) {
    await this.wrapExecutionAsync(async () => {   
      await userService.userDeactivation(input);
      await this.getTraniers();
      notifySuccess();
    }, () => {
      this.loadingTrainers = true;
    }, () => {
      this.loadingTrainers = false;
    });
  }


}

export default TrainerStore;
