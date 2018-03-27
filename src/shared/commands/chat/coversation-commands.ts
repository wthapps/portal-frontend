import { Observable } from "rxjs/Observable";
import { concat } from "rxjs/observable/concat";
import { ApiCommand } from "@shared/commands/common/api-command";

export class ConversationApiCommands extends ApiCommand {

  static markAsRead(conversation: any) {
    return this.createRequest('post', 'zone/chat/notification/mark_as_read', conversation);
  }

  static mostRecentConversations() {
    return this.createRequest('get', 'zone/chat/conversations/most_recent_conversations');
  }

  static markAllAsRead() {
    return this.createRequest('post', 'zone/chat/notification/mark_all_as_read');
  }
}
