import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class WTHConfirmService {
  confirmDialog$: any;
  private confirmDialogSubject = new BehaviorSubject<any[]>([]);

  constructor() {
    this.confirmDialog$ = this.confirmDialogSubject.asObservable();
  }

  updateConfirmDialog(dialog: any) {
    this.confirmDialogSubject.next(dialog);
  }
}
