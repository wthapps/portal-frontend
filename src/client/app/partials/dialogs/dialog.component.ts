import {Component} from '@angular/core';
import {DialogServiceComponent} from './dialog.service';

@Component({
  moduleId: module.id,
  selector: 'confirm-dialog-modal',
  template: `
  <div id="confirm-dialog" class="modal">
    <div class="modal-content">
      <h4>{{dialogService.dialogHeader}}</h4>
      <p>{{dialogService.dialogMessage}}</p>
    </div>
    <div class="modal-footer">
      <a (click)="confirm()" class="modal-action modal-close waves-effect waves-green btn-flat">Agree</a>
      <a (click)="reject()" class="modal-action modal-close waves-effect waves-green btn-flat">Disagree</a>
    </div>
  </div>
  `
})
export class ConfirmDialogComponent {
  constructor(public dialogService:DialogServiceComponent) {
  }

  confirm() {
    this.dialogService.dialogConfirmation();
  }

  reject() {
    this.dialogService.dialogRejection();
  }
}
