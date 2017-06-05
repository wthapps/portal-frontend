export class Message {
  id: number;
  uuid: string;
  message: string;
  message_type: string;
  group_id: number;
  is_quote: boolean;
  constructor() {
    this.message = '';
  }
}
