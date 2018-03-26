import { Observable } from "rxjs/Observable";
import { concat } from "rxjs/observable/concat";
import { ApiCommand } from "@shared/commands/common/api-command";

export class ConversationApiCommands extends ApiCommand {

  static markAsRead(conversation: any) {
    return this.createRequest('post', 'zone/chat/notification/mark_as_read', conversation);
  }

  static markAllAsRead(conversations: any) {
    const observerables = conversations.map((c: any) => {
      return this.markAsRead(conversations);
    })
    return concat(...observerables);
  }
}
