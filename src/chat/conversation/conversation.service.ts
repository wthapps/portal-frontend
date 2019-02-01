import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WHttpClientService } from '@shared/services/w-http-client.service';
import { HttpClient } from '@angular/common/http';
import { Conversation } from '@chat/store';
import { map } from 'rxjs/operators';

@Injectable()
export class ConversationService {
  constructor(private api: WHttpClientService, private httpClient: HttpClient) {}
  url = 'http://localhost:5000/v1/chat/conversations';
  // url = 'chat/conversations';


  get(id: any): Observable<any> {
    return this.httpClient.get(`${this.url}/${id}`);
  }

  getAll(query: any): Observable<any> {
    // return this.api.get(this.url, query);
    return this.httpClient.get<any>(`${this.url}`, {headers: {Accept: 'application/json'}});
  }

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

  cancelUpload(conversationId: number, id: number): Observable<any> {
    return this.api.post(
      `zone/chat/conversations/${conversationId}/cancel_messages/${id}`
    );
  }

  open() {

  }
}
