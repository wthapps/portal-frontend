import { Injectable } from '@angular/core';

import { HConfirmation } from './comfirmation';
import { ConfirmationService } from 'primeng/primeng';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class HConfirmationService {
  confirmDialog$: any;

  // private confirmDialogSubject: any;

  constructor(private confirmationService: ConfirmationService) {
    // this.confirmDialog$ = this.confirmDialogSubject.asObservable();
  }
  confirm(confirmation: HConfirmation) {
    // this.confirmDialogSubject = new BehaviorSubject<HConfirmation>(confirmation);
    this.confirmationService.confirm(confirmation);
    return this;
  }
}
