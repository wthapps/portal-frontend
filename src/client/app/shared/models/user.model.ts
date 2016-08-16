import {CreditCard} from './credit-card.model';

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
  plan_id: string;
  profile_image: string;
  nationality: string;
  phone_number: string;

  constructor(fields: {
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
    credit_cards?: CreditCard[],
    plan_id?: string,
    profile_image?: string,
    nationality?: string,
    phone_number?: string
  }) {
    if (fields) Object.assign(this, fields);
  }
}
