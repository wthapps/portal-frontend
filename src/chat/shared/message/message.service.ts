import { Injectable } from '@angular/core';
import { WHttpClientService } from '@shared/services/w-http-client.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class MessageService {
  url = 'http://localhost:5000/v1/chat/conversations';

  constructor(private api: WHttpClientService, private httpClient: HttpClient) {
  }

  get(id: any): Observable<any> {
    return this.httpClient.get(`${this.url}/${id}`);
  }

  getAll(groupId: number|string, queryParams?: {cursor: 1541674034512}): Observable<any> {
    // return this.api.get(this.url, query);
    return this.httpClient.get<any>(`${this.url}/${groupId}/messages?cursor=${queryParams.cursor}`, {headers: {Accept: 'application/json'}});
  }

}
