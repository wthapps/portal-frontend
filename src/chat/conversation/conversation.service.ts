import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

  leave(id: any): Observable<any> {
    return this.api.post(`${this.url}/${id}/leave`);
  }

  getMembers(id: any, payload: any): Observable<any> {
    return this.api.get(`${this.url}/${id}/members`);
  }

  addMembers(id: any, payload: any): Observable<any> {
    return this.api.post(`${this.url}/${id}/add_members`, payload);
  }

  deleteMember(id: any, payload: any): Observable<any> {
    return this.api.post(`${this.url}/${id}/delete_member`, payload);
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

  open() {

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
