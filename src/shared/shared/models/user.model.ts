import { CreditCard } from './credit-card.model';
import { Plan } from './plan.model';

export class User {
  id: number;
  uuid: string;
  first_name: string;
  last_name: string;
  name: string;
  email: string;
  password: string;
  birthday: string;
  birthday_day: string;
  birthday_month: string;
  birthday_year: string;
  introduction: any;
  sex: number;
  accepted: boolean;
  has_payment_info: boolean;
  credit_cards: CreditCard[];
  plan: Plan;
  plan_registered_at: string;
  plan_id: string;
  profile_image: string;
  nationality: string;
  phone_number: string;
  language: string;
  subscribed: boolean;
  auto_update: boolean;
  use_diagnosis: boolean;
  supporter: boolean;
  took_a_tour: boolean;
  online: boolean;
  term_policy_version: string;
  cover_image: string;

  constructor(fields: {
    id?: number,
    uuid?: string,
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
    plan?: Plan,
    plan_registered_at?: string,
    plan_id?: string,
    profile_image?: string,
    nationality?: string,
    phone_number?: string,
    language?: string,
    subscribed?: boolean,
    auto_update?: boolean,
    use_diagnosis?: boolean,
    supporter?: boolean,
    took_a_tour?: boolean,
    online?: boolean,
    cover_image?: string,
  }) {
    if (fields) Object.assign(this, fields);
  }

}
