import { action, observable } from 'mobx';
import StoreBase from './storeBase';
import { EntityDto } from '../services/dto/entityDto';
import { notifySuccess } from '../lib/notifications';
import { CourseDto } from '../services/courses/dto/courseDto';
import coursesService from '../services/courses/coursesService';
import { CreateCourseDto } from '../services/courses/dto/createCourseDto';
import { UpdateCourseDto } from '../services/courses/dto/updateCourseDto';

class CourseStore extends StoreBase {
  @observable courses: Array<CourseDto> = [];
  @observable loadingCourses = false;
  @observable isSubmittingCourse = false;
  @observable maxResultCount: number = 1000;
  @observable skipCount: number = 0;
  @observable courseModel?: CourseDto = undefined;
  @observable totalCount: number = 0;
  @observable isActiveFilter?: boolean = undefined;
  @observable keyword?: string = undefined;
  @observable categoryId?:number = undefined;
  @observable trainerId?:number = undefined;
  @observable traineeId?:number = undefined;

  @observable hasDiscount?:boolean = undefined;

 

  @action
  async getCourses() {
    await this.wrapExecutionAsync(async () => {
      let result = await coursesService.getAll({
          skipCount:this.skipCount,
          maxResultCount:this.maxResultCount,
          isActive:this.isActiveFilter,
          keyword:this.keyword,
          categoryId:this.categoryId,
          hasDiscount:this.hasDiscount,
          trainerId:this.trainerId,
          traineeId:this.traineeId

      });
      this.courses = result.items;
      this.totalCount=result.totalCount;
    }, () => {
      this.loadingCourses = true;
    }, () => {
      this.loadingCourses = false;
    });
  }

  @action
  async getCourseById(input: EntityDto) {
    await this.wrapExecutionAsync(async () => {
      let course = await coursesService.getCourse(input);
      if (course !== undefined) {
        this.courseModel = {
          id: course.id,
          arDescription:course.arDescription,
          arName:course.arName,
          bookingRequestsCount:course.bookingRequestsCount,
          category:course.category,
          categoryId:course.categoryId,
          createdBy:course.createdBy,
          creationTime:course.creationTime,
          creatorUserId:course.creatorUserId,
          description:course.description,
          discountPercentage:course.discountPercentage,
          enDescription:course.enDescription,
          enName:course.enName,
          fee:course.fee,
          hasDiscount:course.hasDiscount,
          imageUrl:course.imageUrl,
          isActive:course.isActive,
          name:course.name,
          traineesCount:course.traineesCount,
          trainer:course.trainer,
          trainerId:course.trainerId,
          trainingHoursCount:course.trainingHoursCount,
          viewsCount:course.viewsCount
        };
      }
    }, () => {
      this.loadingCourses = true;
    }, () => {
      this.loadingCourses = false;
    });
   
  }

  @action
  async createCourse(input: CreateCourseDto) {
    await this.wrapExecutionAsync(async () => {
      await coursesService.createCourse(input);
      await this.getCourses();
      notifySuccess();
    }, () => {
      this.isSubmittingCourse = true;
    }, () => {
      this.isSubmittingCourse = false;
    });
  }

  @action
  async updateCourses(input: UpdateCourseDto) {
    await this.wrapExecutionAsync(async () => {
      await coursesService.updateCourse(input);
      await this.getCourses();
      notifySuccess();
    }, () => {
      this.isSubmittingCourse = true;
    }, () => {
      this.isSubmittingCourse = false;
    });
  }


  @action
  async getCourse(input: EntityDto) {
    let course = this.courses.find(c => c.id === input.id);
    if (course !== undefined) {
      this.courseModel = {
        id: course.id,
        arDescription:course.arDescription,
        arName:course.arName,
        bookingRequestsCount:course.bookingRequestsCount,
        category:course.category,
        categoryId:course.categoryId,
        createdBy:course.createdBy,
        creationTime:course.creationTime,
        creatorUserId:course.creatorUserId,
        description:course.description,
        discountPercentage:course.discountPercentage,
        enDescription:course.enDescription,
        enName:course.enName,
        fee:course.fee,
        hasDiscount:course.hasDiscount,
        imageUrl:course.imageUrl,
        isActive:course.isActive,
        name:course.name,
        traineesCount:course.traineesCount,
        trainer:course.trainer,
        trainerId:course.trainerId,
        trainingHoursCount:course.trainingHoursCount,
        viewsCount:course.viewsCount
      };
    }
  }


  @action
  async courseActivation(input: EntityDto) {
    await this.wrapExecutionAsync(async () => {   
      await coursesService.courseActivation(input);
      await this.getCourses();
      notifySuccess();
    }, () => {
      this.loadingCourses = true;
    }, () => {
      this.loadingCourses = false;
    });
  }
  @action
  async courseDeactivation(input: EntityDto) {
    await this.wrapExecutionAsync(async () => {   
      await coursesService.courseDeactivation(input);
      await this.getCourses();
      notifySuccess();
    }, () => {
      this.loadingCourses = true;
    }, () => {
      this.loadingCourses = false;
    });
  }

}

export default CourseStore;
