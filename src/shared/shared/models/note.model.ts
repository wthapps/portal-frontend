import { BaseEntity } from './base-entity.model';
export class Note extends BaseEntity {
  name = '';
  content = '';

  tags: Array<any> = [];
  attachments: Array<any> = [];
  user: any;
  owner: any;
  user_id: number;
  folder: any;
  parent_id: number = null;
  object_type = 'Note::Note';
  permission: string;
  favourite: any;

  constructor(attributes: any = {}) {
    super(attributes);
  }
}
