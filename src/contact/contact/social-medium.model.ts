import { BaseEntity } from '../../shared/shared/models/base-entity.model';

export class SocialMedium extends BaseEntity {
  category: string = 'wthapps';
  value: string = '';
  primary: boolean = false;
}
