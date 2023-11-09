
export interface CreateProductDto {
    arName:string;
    enName:string;
    price:number;
    shopId:number;
    categoryId:number;
    enComponents:string;
    arComponents:string;
    images:Array<string>;
}
      