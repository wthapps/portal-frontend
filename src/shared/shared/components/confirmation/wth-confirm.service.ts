import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ConfirmationService } from 'primeng/components/common/confirmationservice';

export interface ConfirmInfo {
  message: string;
  header: string;
  icon: string;
  acceptLabel: string;
  rejectLabel: string;
  accept: Function;
  reject: Function;
}

const initConfirmInfo: ConfirmInfo = {
  message: null,
  header: null,
  icon: null,
  acceptLabel: 'Done',
  rejectLabel: 'Cancel',
  accept: () => { return; },
  reject: () => { return; },
};


@Injectable()
export class WthConfirmService {
  confirmDialog$: any;
  private confirmDialogSubject = new BehaviorSubject<ConfirmInfo>(initConfirmInfo);

  constructor(private confirmationService: ConfirmationService) {
    this.confirmDialog$ = this.confirmDialogSubject.asObservable();
  }

  // updateConfirmDialog(dialog: any) {
  //   this.confirmDialogSubject.next(dialog);
  // }

  confirm(option: any) {
    const moreOption = Object.assign({}, initConfirmInfo, option);

    this.confirmDialogSubject.next(moreOption);
    this.confirmationService.confirm(option);

    return this;
  }
}
