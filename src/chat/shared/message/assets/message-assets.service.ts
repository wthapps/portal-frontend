import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { distinctUntilChanged } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class MessageAssetsService {
  open$: Observable<boolean>;
  private openSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor() {
    this.open$ = this.openSubject.asObservable().pipe(distinctUntilChanged());
    this.openSubject.next(false);
  }

  open() {
    this.openSubject.next(true);
    // this.renderer.addClass(document.body, 'open-chat-message-assets');
  }

  close() {
    this.openSubject.next(false);
    // this.renderer.removeClass(document.body, 'open-chat-message-assets');
  }
}
