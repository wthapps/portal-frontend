import { BaseEntity } from '../../shared/shared/models/base-entity.model';

export class CustomField extends BaseEntity {
  category: string = '';
  value: string = '';
  primary: boolean = false;
  user_id?: number;
  user?: any;
}
