import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WHttpClientService } from '@shared/services/w-http-client.service';
import { HttpClient } from '@angular/common/http';
import { Conversation } from '@chat/store';
import { map } from 'rxjs/operators';
import { ApiBaseService } from '@shared/services';

@Injectable()
export class ConversationService {
  constructor(private api: WHttpClientService, private httpClient: HttpClient, private apiBaseService: ApiBaseService) {}
  // url = 'http://localhost:5000/v1/chat/conversations';
  url = 'http://localhost:4000/chat/conversations';
  path = 'chat/conversations';
  pageSize = 30;
  // url = 'chat/conversations';


  get(id: any): Observable<any> {
    return this.httpClient.get(`${this.url}/${id}`);
  }

  getAll(query: any): Observable<any> {
    if (!query) {
      // query = `?page[size]=${this.pageSize}`;
      query = `?per_page=${this.pageSize}`;

    } else {
      query = `?${query}`;
    }
    // return this.api.get(this.url, query);
    return this.httpClient.get<any>(`${this.url}${query}`, {headers: {Accept: 'application/json'}});
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
