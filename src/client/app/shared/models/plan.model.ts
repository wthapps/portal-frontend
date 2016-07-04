import {Product} from "./product.model";
export class Plan {

  id: number;
  str_id: string;
  name: string;
  description: string;
  price: any;
  currency_iso_code: string;
  billing_day_of_month: number;
  billing_frequency:any;
  number_of_billing_cycles: number;
  trial_duration_unit: string;
  trial_period: any;
  trial_duration: any;
  is_trial: boolean;
  products: Product[];

  constructor(
    fields?:{
      id?: number,
      str_id?: string,
      name?: string,
      description?: string,
      price?: any,
      currency_iso_code?: string,
      billing_day_of_month?: number,
      billing_frequency?: any,
      number_of_billing_cycles?: number,
      trial_duration_unit?: string,
      trial_period?: any,
      trial_duration?: any,
      is_trial?: boolean,
      products?: Product[]
    }
  ){
    if (fields) Object.assign(this, fields);
  }

}
