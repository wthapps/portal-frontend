import { BaseModel } from '../base.model';

export class UserContact extends BaseModel {
  id: number;
  uuid: string;
  first_name: string;
  last_name: string;
  name: string = '';
  emails: Array<any> = [];
  password: string;
  birthday: string;
  birthday_day: string;
  birthday_month: string;
  birthday_year: string;
  sex: number;
  accepted: boolean;
  has_payment_info: boolean;
  credit_cards: any;
  plan: any;
  plan_registered_at: string;
  plan_id: string;
  nationality: string;
  phones: Array<any> = [];
  addresses: Array<any> = [];
  media: Array<any> = [];
  language: string;
  subscribed: boolean;
  auto_update: boolean;
  use_diagnosis: boolean;
  supporter: boolean;
  online: boolean;
  profile_image: string = 'https://s3-us-west-2.amazonaws.com/env-staging-oregon/portal-frontend/common-images/avartart/default.png';

  constructor(obj?: any) {
    super();
    this.init(obj);
  }
}
