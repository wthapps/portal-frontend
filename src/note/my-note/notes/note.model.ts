import { BaseEntity } from '@shared/shared/models/base-entity.model';
class Note extends BaseEntity {
  name: string;
  content: string;
  tags: Array<any>;
  attachments: Array<any>;
  user: any;
  user_id: number;
  folder: any;
  folder_id: number;
  permission: string;

  constructor(attributes: any = {}) {
    super(attributes);
  }
}
