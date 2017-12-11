import { BaseEntity } from '../../shared/shared/models/base-entity.model';

export class Group extends BaseEntity {
  name: string;
  system: boolean;
  user_id?: number;
  user?: any;
  order?: number;
  contact_count?: number;

  convertToMenuItem(): any {
    return {
      testing: ''
    };
  }
}
