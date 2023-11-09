
export interface UpdateDishDto {
    id:number;
    arName:string;
    enName:string;
    price:number;
    restaurantId:number;
    categoryId:number;
    enComponents:string;
    arComponents:string;
    images:Array<string>;
}
      