import { BaseEntity } from '../../shared/shared/models/base-entity.model';

export class Email extends BaseEntity {
  category = 'work';
  value = '';
  primary = false;
  wthapps_user: any;
}
