import { BaseEntity } from './base-entity.model';
export class Note extends BaseEntity {
  name: string = '';
  content: string = '';

  tags: Array<any> = [];
  attachments: Array<any> = [];
  user: any;
  user_id: number;
  folder: any;
  parent_id: number = null;
  object_type: string = 'note';
  permission: string;
  favourite: any;

  constructor(attributes: any = {}) {
    super(attributes);
  }
}
