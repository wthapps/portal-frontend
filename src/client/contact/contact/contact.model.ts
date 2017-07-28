import { BaseEntity } from '../../core/shared/models/base-entity.model';
import { Address } from './address.model';
import { SocialMedium } from './social-medium.model';
import { CustomField } from './custom-field.model';
import { Email } from './email.model';
import { Phone } from './phone.model';

export class Contact extends BaseEntity {
  profile_image: string = '';
  name: string = '';
  company: string = '';
  job_title: string = '';
  notes: string = '';
  description: string = '';
  primary: boolean = false;
  birthday: any;
  addresses: Array<Address>;
  phones: Array<Phone>;
  emails: Array<Email>;
  media: Array<SocialMedium>;
  custom_fields: Array<CustomField>;
  user?: any;
  wthapps_user?: any;

  // constructor(options: any) {
  //   super(options);
  // }
}
