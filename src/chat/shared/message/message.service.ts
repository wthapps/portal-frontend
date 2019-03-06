import { Injectable } from '@angular/core';
import { WHttpClientService } from '@shared/services/w-http-client.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiBaseService, BaseEntityService } from '@shared/services';

@Injectable()
export class MessageService extends BaseEntityService<any> {
  // url = 'http://localhost:5000/v1/chat/conversations';
  url = 'http://localhost:4000/chat/conversations';
  path = 'chat/conversations';
  constructor(protected apiBaseService: ApiBaseService, private httpClient: HttpClient) {
    super(apiBaseService);
  }

  get(id: any): Observable<any> {
    return this.httpClient.get(`${this.url}/${id}`);
  }

  getAll(conversationId: number|string, queryParams?: {cursor: 1541674034512}): Observable<any> {
    // return this.api.get(this.url, query);
    return this.httpClient.get<any>(`${this.url}/${conversationId}/messages?cursor=${queryParams.cursor}`, {headers: {Accept: 'application/json'}});
  }

  create(payload: any): Observable<any> {
    return this.apiBaseService.post(`${this.path}/${payload.conversationId}/messages`, {message: payload.message});
  }

}
