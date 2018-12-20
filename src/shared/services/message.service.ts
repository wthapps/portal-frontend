import { ApiBaseService } from './apibase.service';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { StripHtmlPipe } from '@shared/shared/pipe/strip-html.pipe';
import { BaseEntityService } from './base-entity-service';

@Injectable()
export class WMessageService extends BaseEntityService<any> {
  scrollToBottom$: Observable<boolean>;
  private scrollToBottomSubject: Subject<boolean> = new Subject<boolean>();
  private stripHtmlPipe = new StripHtmlPipe();

  constructor(private api: ApiBaseService) {
    super(api);
    this.url = 'zone/chat/message';
    this.scrollToBottom$ = this.scrollToBottomSubject.asObservable();
  }

  // sendMessage(message: any): Observable<Response> {
  //   return this.api.post(`chat_support/messages`, message);
  // }

  scrollToBottom() {
    this.scrollToBottomSubject.next(true);
  }

  notEmptyHtml(htmlContent: string): boolean {
    return htmlContent && !!this.stripHtmlPipe.transform(htmlContent).trim();
  }

}
