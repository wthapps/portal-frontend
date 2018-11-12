import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class ZChatShareAddContactService {
  open$: any;
  addMembers$: Observable<any>;
  private openSubject: Subject<any> = new Subject<any>();
  private addMembersSubject = new Subject<any>();

  constructor() {
    this.open$ = this.openSubject.asObservable();
    this.addMembers$ = this.addMembersSubject.asObservable();
  }

  open(type: string) {
    this.openSubject.next(type);
  }

  addMembers(users: any) {
    this.addMembersSubject.next(users);
  }

  close() {
    this.openSubject.next(null);
    this.openSubject.complete();
    this.addMembersSubject.next();
    this.addMembersSubject.complete();
  }

}
