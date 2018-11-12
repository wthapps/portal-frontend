import { BaseEntity } from '../../shared/shared/models/base-entity.model';

export class Address extends BaseEntity {
  category = 'work';
  house_number?: string;
  house_name?: string;
  street_name?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  province?: string;
  country?: string;
  postcode?: string;
  primary = false;
  contact?: any;
  contact_id?: number;
}
