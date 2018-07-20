import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ApiBaseService } from '@wth/shared/services';

@Injectable()
export class ConversationService {
  constructor(private api: ApiBaseService) {}
  url = 'chat/conversations';

  create(payload: any): Observable<any> {
    const conversation = {
      conversation: {
        users: payload
      }
    };
    return this.api.post(this.url, conversation);
  }

  update(id: any, payload: any): Observable<any> {
    return this.api.put(`${this.url}/${id}`, payload);
  }

  delete(id: any): Observable<any> {
    return this.api.delete(`${this.url}/${id}`);
  }

  // hide conversation from your conversations
  hide(id: any, payload: any): Observable<any> {
    return this.api.patch(`${this.url}/${id}`, payload);
  }

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

  // getLatestConversation(groupId: number) {
  //   return this.api
  //     .get('zone/chat/messages/' + groupId)
  //     .toPromise()
  //     .then((response: any) => {
  //       this.chatService.storage.save(
  //         'chat_messages_group_' + groupId,
  //         response
  //       );
  //     });
  // }
}
