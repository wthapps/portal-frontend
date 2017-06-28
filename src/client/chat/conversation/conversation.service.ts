import { Injectable } from '@angular/core';
import { ApiBaseService } from '../../core/shared/services/apibase.service';
import { ChatService } from '../shared/services/chat.service';

@Injectable()
export class ConversationService {

  constructor(private api: ApiBaseService, private chatService: ChatService) {

  }

  deleteMessage(conversationId: number, id: number) {
    return this.api.delete(`zone/chat/conversations/${conversationId}/messages/${id}`);
  }

  getLatestConversation(groupId: number) {
    return this.api.get('zone/chat/messages/' + groupId).subscribe(
      (response: any) => {
        this.chatService.storage.save('chat_messages_group_' + groupId, response);
      }
    );
  }

}
