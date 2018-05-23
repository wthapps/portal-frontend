import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MessageService {
  scrollToBottom$: Observable<boolean>;
  private scrollToBottomSubject: Subject<boolean> = new Subject<boolean>();

  constructor() {
    this.scrollToBottom$ = this.scrollToBottomSubject.asObservable();
  }

  scrollToBottom() {
    this.scrollToBottomSubject.next(true);
  }
}
