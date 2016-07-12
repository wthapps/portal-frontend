import {CreditCard} from "./credit-card.model";

export class User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  birthday: string;
  birthday_day: string;
  birthday_month: string;
  birthday_year: string;
  sex: number;
  accepted: boolean;
  has_payment_info: boolean;
  credit_cards: CreditCard[];
  
  constructor(
    fields:{
      id: number,
      first_name?: string,
      last_name?: string,
      email?: string,
      password?: string,
      birthday?: string,
      birthday_day?: string,
      birthday_month?: string,
      birthday_year?: string,
      sex?: number,
      accepted?: boolean,
      has_payment_info?: boolean,
      credit_cards?: CreditCard[]
    }) {
    if (fields) Object.assign(this, fields);
  }
}
