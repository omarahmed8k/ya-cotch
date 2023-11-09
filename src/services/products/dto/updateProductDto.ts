
export interface UpdateProductDto {
    id:number;
    arName:string;
    enName:string;
    price:number;
    shopId:number;
    categoryId:number;
    enComponents:string;
    arComponents:string;
    images:Array<string>;
}
      