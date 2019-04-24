import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiBaseService, BaseEntityService } from '@shared/services';

@Injectable()
export class MessageService extends BaseEntityService<any> {
  // url = 'http://localhost:5000/v1/chat/conversations';
  // url = 'http://localhost:4000/chat/conversations';
  path = 'chat/conversations';
  constructor(protected apiBaseService: ApiBaseService, private httpClient: HttpClient) {
    super(apiBaseService);
  }

  get(id: any): Observable<any> {
    return this.httpClient.get(`${this.url}/${id}`);
  }

  create(payload: any): Observable<any> {
    return this.apiBaseService.post(`${this.path}/${payload.conversationId}/messages`, {message: payload.message});
  }

  update(conversationId: string, message: any): Observable<any> {
    const url = `${this.path}/${conversationId}/messages/${message.uuid}`;
    return this.apiBaseService.patch(url, { message: message });
  }

  delete(conversationId: string, id: string): Observable<any> {
    const url = `${this.path}/${conversationId}/messages`;
    return this.apiBaseService.delete(`${url}/${id}`);
  }

  download(conversationId: string, id: string): Observable<any> {
    return this.apiBaseService.download(`${this.path}/${conversationId}/messages/${id}/download`);
  }

}
