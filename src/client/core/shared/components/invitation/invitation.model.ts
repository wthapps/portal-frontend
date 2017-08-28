import { BaseEntity } from '../../models/base-entity.model';
export class Invitation extends BaseEntity {

  recipient_email: string;
  recipient_full_name: string;
  recipient_contact_id: string;
  recipient_json: string;
  sent_count: number;
  content: string;
  user_id: number;
  user: any;

  constructor(attributes: any={}) {
    super(attributes);
  }
}
