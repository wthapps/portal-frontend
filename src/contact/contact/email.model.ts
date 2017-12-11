import { BaseEntity } from '../../shared/shared/models/base-entity.model';

export class Email extends BaseEntity {
  category: string='work';
  value: string='';
  primary: boolean = false;
}
