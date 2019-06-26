import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WHttpClientService } from '../w-http-client.service';
import { ApiBaseService, BaseEntityService } from '..';

@Injectable()
export class ConversationService extends BaseEntityService<any> {
  url = 'chat/conversations';
  path = 'chat/conversations';
  // url = 'chat/conversations';

  constructor(private api: WHttpClientService, protected apiBaseService: ApiBaseService) {
    super(apiBaseService);
  }

  create(payload: any): Observable<any> {
    const conversation = {
      conversation: {
        users: payload.users
      }
    };
    return this.apiBaseService.post(this.path, conversation);
  }

  update(id: any, payload: any): Observable<any> {
    return this.apiBaseService.patch(`${this.url}/${id}`, payload);
  }

  updateDisplay(id: any, payload: any): Observable<any> {
    return this.apiBaseService.patch(`${this.url}/${id}/display`, payload);
  }

  acceptInvitation(id: any): Observable<any> {
    return this.apiBaseService.patch(`${this.url}/${id}/accept`);
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

  cancelUpload(conversationId: number, id: number): Observable<any> {
    return this.api.post(
      `zone/chat/conversations/${conversationId}/cancel_messages/${id}`
    );
  }

  markAsRead(id: string): Observable<any> {
    return this.apiBaseService.patch(`${this.url}/${id}/mark_as_read`);
  }

  markAllAsRead(): Observable<any> {
    return this.apiBaseService.post(
      `chat/notifications/mark_all_as_read`
    );
  }
}
