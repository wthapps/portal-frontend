import { BaseEntity } from '@shared/shared/models/base-entity.model';
class Note extends BaseEntity {

  title: string;
  content: string;
  tags: Array<any>;
  attachments: Array<any>;
  user: any;
  user_id: number;
  folder: any;
  folder_id: number;


  constructor(attributes: any={}) {
    super(attributes);
  }
}
