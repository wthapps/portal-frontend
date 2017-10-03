import { BaseEntity } from './base-entity.model';
export class Note extends BaseEntity {

  title: string;
  content: string;

  tags: Array<any> = new Array<any>();
  attachments: Array<any>;
  user: any;
  user_id: number;
  folder: any;
  folder_id: number;
  object_type: string = 'note';

  constructor(attributes: any={}) {
    super(attributes);
  }
}


