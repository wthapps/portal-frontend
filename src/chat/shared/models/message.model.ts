export class Message {
  id: number;
  uuid: string;
  message: string;
  message_type: string; //Richtext, Richtext
  original_type: string;
  content_type: string;
  group_id: number;
  user: any;
  owner;
  group: any; //this is conversation that message belongs to
  is_quote: boolean;
  sending_status: number;
  status: string;
  meta_data: any;
  deleted: boolean;
  created_at: string;
  updated_at: string;
  client_id: string;

  constructor(obj?: any) {
    this.id = (obj && obj.id) || 0;
    this.uuid = (obj && obj.uuid) || '';
    this.message = (obj && obj.message) || '';
    this.message_type = (obj && obj.message_type) || 'text';
    this.content_type = (obj && obj.content_type) || 'text';
    this.original_type = (obj && obj.original_type) || '';
    this.group = (obj && obj.group) || null;
    this.group_id = (obj && obj.group_id) || null;
    this.user = (obj && obj.user) || null;
    this.owner = (obj && obj.owner) || null;
    this.is_quote = (obj && obj.is_quote) || false;
    this.sending_status = (obj && obj.sending_status) || 1;
    this.status = (obj && obj.status) || 'sending';
    this.client_id = (obj && obj.client_id) || '';
    this.deleted = (obj && obj.deleted) || false;
    this.meta_data = (obj && obj.meta_data) || {};
  }
}
