import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';

import { ChatService } from '../shared/services/chat.service';
import { ApiBaseService } from '@wth/shared/services';

@Injectable()
export class ConversationService {
  constructor(private api: ApiBaseService, private chatService: ChatService) {}

  deleteMessage(conversationId: number, id: number): Observable<any> {
    return this.api.delete(
      `zone/chat/conversations/${conversationId}/messages/${id}`
    );
  }

  cancelUpload(conversationId: number, id: number): Observable<any> {
    return this.api.post(
      `zone/chat/conversations/${conversationId}/cancel_messages/${id}`
    );
  }

  getLatestConversation(groupId: number) {
    return this.api
      .get('zone/chat/messages/' + groupId)
      .toPromise()
      .then((response: any) => {
        this.chatService.storage.save(
          'chat_messages_group_' + groupId,
          response
        );
      });
  }
}
