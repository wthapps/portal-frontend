import { BaseEntity } from '@wth/shared/shared/models/base-entity.model';
class ConversationDisplay {
  id: number;
  image: string;
  name: string;
  uuid: string;
}

class BasicUser {
  id: number;
  image?: string;
  profile_image?: string;
  name: string;
  uuid: string;
}

class ChatGroup {
  created_at: string;
  creator_id: number;
  group_type: string;
  id: number;
  image: string;
  interacted_at: string;
  member_count: 2;
  name: string;
  updated_at: string;
  users_json: BasicUser[];
  users_name: string
  uuid: string
}

class LocalMessage {
  content_type: string;
  created_at: string;
  deleted_at: boolean;
  display: BasicUser;
  file_id: string;
  file_json: string;
  file_type: string;
  group_id: number;
  id: number;
  message: string;
  meesage_type: string;
  original_type: string;
  receiver_id: string;
  sending_status: number;
  status: string;
  updated_at: string;
  user_id: number;
  uuid: string;
}

export class Conversation extends BaseEntity {
  active: boolean;
  blacklist: boolean;
  display: ConversationDisplay;
  favorite: boolean;
  group_id: number;
  group_json: ChatGroup;
  group: ChatGroup;
  group_type: string;
  history: false;
  latest_message: LocalMessage;
  leave: boolean;
  notification: boolean;
  notification_count: number;
  partner_id: number;
  role: string;
  status: string;
  updated_chat_at: string;
  user_id: number;
}

// export default { Conversation, ChatGroup };
