import http from '../httpService';
import { PagedResultDto } from '../dto/pagedResultDto';
import { EntityDto } from '../dto/entityDto';
import { ProductsFilterAndSortedRequest } from './dto/productFilterAndSortedRequest';
import { ProductDto } from './dto/productDto';
import { UpdateProductDto } from './dto/updateProductDto';
import { CreateProductDto } from './dto/createProductDto';

class ProductsService {

  public async getAll(input: ProductsFilterAndSortedRequest): Promise<PagedResultDto<ProductDto>> {
    let result = await http.get('api/services/app/Product/GetAll', { 
      params: {skipCount:input.skipCount, maxResultCount:input.maxResultCount,
        isActive:input.isActive,keyword:input.keyword,
      categoryId:input.categoryId,
      shopId:input.shopId,
      minPrice:input.minPrice,
      maxPrice:input.maxPrice } });
    return result.data.result;
  }

  public async getProduct(input: EntityDto):Promise<ProductDto>  {
    let result = await http.get('api/services/app/Product/Get', { params: {id:input.id} });
    return result.data.result;
  }

  public async createProduct(input: CreateProductDto):Promise<ProductDto> {
    let result = await http.post('api/services/app/Product/Create', input);
    return result.data;
  }

  public async updateProduct(input: UpdateProductDto):Promise<ProductDto> {
    let result = await http.put('api/services/app/Product/Update', input);
    return result.data;
  }

  public async productActivation(input: EntityDto) {
    let result = await http.put('api/services/app/Product/Activate', input);
    return result.data;
  }
  public async productDeactivation(input: EntityDto) {
    let result = await http.put('api/services/app/Product/DeActivate', input);
    return result.data;
  }
  
}

export default new ProductsService();
