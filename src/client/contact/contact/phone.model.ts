import { BaseEntity } from '../../core/shared/models/base-entity.model';
export class Phone extends BaseEntity {
  category: string='mobile';
  value: string='';
  country_alpha_code?: string='';
  primary: boolean = false;
}
