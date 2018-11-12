import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class ModalService {
  open$: Observable<any>;
  close$: Observable<any>;
  dismiss$: Observable<any>;

  private openSubject: Subject<any> = new Subject<any>();
  private closeSubject: Subject<any> = new Subject<any>();
  private dismissSubject: Subject<any> = new Subject<any>();

  constructor() {
    this.open$ = this.openSubject.asObservable();
    this.close$ = this.openSubject.asObservable();
    this.dismiss$ = this.openSubject.asObservable();
  }

  open(options: any) {
    this.openSubject.next(options);
  }

  close() {
    this.openSubject.next(null);
    this.openSubject.complete();

    this.closeSubject.next(null);
    this.closeSubject.complete();

    this.dismissSubject.next(null);
    this.dismissSubject.complete();
  }
}
