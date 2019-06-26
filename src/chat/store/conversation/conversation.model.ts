export interface Conversation {
  id: string;
  uuid: string;
  name: string;
  profile_image: string;
  favorite: boolean;
  blacklist: boolean;
  allow_add: boolean;
  updated_chat_at: any;
  notification_count: number;
  notification: boolean;
}
