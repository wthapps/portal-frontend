import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { StripHtmlPipe } from '@shared/shared/pipe/strip-html.pipe';

@Injectable()
export class WMessageService {
  scrollToBottom$: Observable<boolean>;
  private scrollToBottomSubject: Subject<boolean> = new Subject<boolean>();
  private stripHtmlPipe = new StripHtmlPipe();

  constructor() {
    this.scrollToBottom$ = this.scrollToBottomSubject.asObservable();
  }

  scrollToBottom() {
    // this.scrollToBottomSubject.next(true);
  }

  notEmptyHtml(htmlContent: string): boolean {
    return !!this.stripHtmlPipe.transform(htmlContent).trim();
  }

}
