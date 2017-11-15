import { BaseEntity } from '../base-entity.model';

export class AddressModel extends BaseEntity {
  category: string = 'work';
  house_number?: string;
  house_name?: string;
  street_name?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  province?: string;
  country?: string;
  postcode?: string;
  primary: boolean = false;
  contact?: any;
  contact_id?: number;
}

export class PhoneModel extends BaseEntity {
  category: string = 'mobile';
  value: string = '';
  country_alpha_code?: string = '';
  primary: boolean = false;
}

export class EmailModel extends BaseEntity {
  category: string = 'work';
  value: string = '';
  primary: boolean = false;
}

export class SocialModel extends BaseEntity {
  category: string = 'wthapps';
  value: string = '';
  primary: boolean = false;
}

export class ProfileModel extends BaseEntity {
  profile_image: string = '';
  name: string = '';
  company: string = '';
  job_title: string = '';
  notes: string = '';
  description: string = '';
  primary: boolean = false;
  birthday: any;
  addresses: AddressModel[];
  phones: PhoneModel[];
  emails: EmailModel[];
  media: SocialModel[];
  custom_fields: any;
  user?: any;
  wthapps_user?: any;
  labels: any;
}
