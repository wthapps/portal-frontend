import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ZChatShareAddContactService {
  open$: any;
  private openSubject: Subject<any> = new Subject<any>();

  constructor() {
    this.open$ = this.openSubject.asObservable();
  }

  open(type: string) {
    this.openSubject.next(type);
  }

  close() {
    this.openSubject.next(null);
  }

}
