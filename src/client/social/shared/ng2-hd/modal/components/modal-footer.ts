import { Component, Input } from '@angular/core';
import { HdModalComponent } from './modal';

@Component({
  selector: 'hd-modal-footer',
  template: `
    <div class='modal-footer'>
      <ng-content></ng-content>
      <button *ngIf='showDefaultButtons' type='button' class='btn btn-default' data-dismiss='modal' (click)='modal.dismiss()'>{{dismissButtonLabel}}</button>
      <button *ngIf='showDefaultButtons' type='button' class='btn btn-primary' (click)='modal.close()'>{{closeButtonLabel}}</button>
    </div>
  `
})
export class HdModalFooterComponent {
  @Input() showDefaultButtons: any = false;
  @Input() public dismissButtonLabel: string = 'Dismiss';
  @Input() public closeButtonLabel: string = 'Close';

  constructor(private modal: HdModalComponent) {
  }
}
