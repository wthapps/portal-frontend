import { Component, Input } from '@angular/core';
import { HdModalComponent } from './modal';

@Component({
  selector: 'hd-modal-header',
  template: `<div class='modal-header' [ngClass]='getCssClasses()'>
                  <button *ngIf='showClose' type='button' class='close' [ngClass]='getClosePosition()' data-dismiss='modal' aria-label='Close' (click)='modal.dismiss()'>
                  <span aria-hidden='true'>&times;</span></button><ng-content></ng-content>
                </div>`
})
export class HdModalHeaderComponent {
  @Input() showClose: boolean = false;
  @Input() closePosition: string = '';
  @Input() cssClass: string = '';

  constructor(public modal: HdModalComponent) {
  }

  getCssClasses(): string {
    let classes: string[] = [];

    if (this.cssClass !== '') {
      classes.push(this.cssClass);
    }

    return classes.join(' ');
  }

  getClosePosition(): string {
    let classes: string[] = [];

    if (this.closePosition !== '') {
      classes.push(this.closePosition);
    }

    return classes.join(' ');
  }
}
