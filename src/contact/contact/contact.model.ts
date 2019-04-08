import { BaseEntity } from '../../shared/shared/models/base-entity.model';

import { Address } from '../../shared/user/models/address.model';
import { SocialMedium } from './social-medium.model';
import { CustomField } from './custom-field.model';
import { Email } from './email.model';
import { Phone } from './phone.model';
import { Card } from '@contacts/shared/card/card.model';

export class Contact extends BaseEntity {
  profile_image = '';
  name = '';
  family_name = '';
  company = '';
  job_title = '';
  notes = '';
  description = '';
  primary = false;
  birthday: any;
  addresses: Array<Address>;
  phones: Array<Phone>;
  emails: Array<Email>;
  media: Array<SocialMedium>;
  custom_fields: Array<CustomField>;
  user?: any;
  wthapps_user?: any;
  groups: any;
  using_default_profile_image?: boolean; // TODO: Remove later
  public_cards?: Card[];

  // constructor(options: any) {
  //   super(options);
  // }
}
