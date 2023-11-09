import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';
import { EntityDto } from '../dto/entityDto';
import { UpdateCourseDto } from './dto/updateCourseDto';
import { CourseDto } from './dto/courseDto';
import { CreateCourseDto } from './dto/createCourseDto';
import { CoursesFilterAndSortedRequest } from './dto/coursesFilterAndSortedRequest';
import { LiteEntityDto } from '../dto/liteEntityDto';

class CoursesService {

  public async getAll(input: CoursesFilterAndSortedRequest): Promise<PagedResultDto<CourseDto>> {
    let result = await http.get('api/services/app/Course/GetAll', { params: {skipCount:input.skipCount, maxResultCount:input.maxResultCount,isActive:input.isActive,keyword:input.keyword,
      categoryId:input.categoryId,
      trainerId:input.trainerId,
      traineeId:input.traineeId,

      hasDiscount:input.hasDiscount } });
    return result.data.result;
  }

  public async getCourse(input: EntityDto):Promise<CourseDto>  {
    let result = await http.get('api/services/app/Course/Get', { params: {id:input.id} });
    return result.data.result;
  }

  public async getAllLite(): Promise<PagedResultDto<LiteEntityDto>> {
    let result = await http.get('api/services/app/Course/GetAllLite');
    return result.data.result;
  }

  public async createCourse(input: CreateCourseDto):Promise<CourseDto> {
    let result = await http.post('api/services/app/Course/Create', input);
    return result.data;
  }

  public async updateCourse(input: UpdateCourseDto):Promise<CourseDto> {
    let result = await http.put('api/services/app/Course/Update', input);
    return result.data;
  }

  public async courseActivation(input: EntityDto) {
    let result = await http.put('api/services/app/Course/Activate', input);
    return result.data;
  }
  public async courseDeactivation(input: EntityDto) {
    let result = await http.put('api/services/app/Course/DeActivate', input);
    return result.data;
  }
  
}

export default new CoursesService();
