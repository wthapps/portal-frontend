import { Injectable } from '@angular/core';
import { ApiBaseService, BaseEntityService } from '@wth/shared/services';
import { Observable } from 'rxjs';

@Injectable()
export class MemberService extends BaseEntityService<any> {

  constructor(protected apiBaseService: ApiBaseService) {
    super(apiBaseService);
    this.url = 'chat/conversations';
  }

  add(conversationId: string, body: any): Observable<any> {
    const url = `${this.url}/${conversationId}/members/add`;
    return this.apiBaseService.post(url, body);
  }

  remove(conversationId: string, body: any): Observable<any> {
    const url = `${this.url}/${conversationId}/members/remove`;
    return this.apiBaseService.post(url, body);
  }

  leave(conversationId: string): Observable<any> {
    const url = `${this.url}/${conversationId}/members/leave`;
    return this.apiBaseService.post(url, {});
  }

}
