import { BaseModel } from '../base.model';

export class UserInfo extends BaseModel {
  id: number;
  uuid: string;
  first_name: string = '';
  last_name: string = '';
  name: string = '';
  emails: Array<any> = [];
  birthday: string;
  birthday_day: string;
  birthday_month: string;
  birthday_year: string;
  sex: number;
  accepted: boolean;
  has_payment_info: boolean;
  credit_cards: any;
  nationality: string;
  phones: Array<any> = [];
  addresses: Array<any> = [];
  media: Array<any> = [];
  language: string;
  online: boolean;
  nickname: string;
  profile_image: string = 'https://s3-us-west-2.amazonaws.com/env-staging-oregon/portal-frontend/common-images/avartart/default.png';

  constructor(obj?: any) {
    super();
    this.init(obj);
  }
}
