import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

// Notice: This service is designed to communicate with modals only
@Injectable()
export class DriveModalService {
  modalEvent$: Observable<any>;
  private modalEventSubject: Subject<any> = new Subject<any>();

  constructor() {
    this.modalEvent$ = this.modalEventSubject.asObservable();
  }

  next(event) {
    this.modalEventSubject.next(event);
  }
}
