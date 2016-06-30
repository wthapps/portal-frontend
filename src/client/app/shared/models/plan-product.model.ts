import {Product} from "./product.model";

export class PlanProduct {

  id: number;
  str_id: string;
  name: string;
  products: Product[];

  constructor(
    fields?:{
      id?: number,
      str_id?: string,
      name?: string,
      products?: Product[]      
    }
  ){
    if (fields) Object.assign(this, fields);
  }

}
