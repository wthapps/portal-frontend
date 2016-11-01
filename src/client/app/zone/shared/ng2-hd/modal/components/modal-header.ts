import { Component, Input, Inject } from '@angular/core';
import { HdModalComponent } from './modal';

@Component({
    selector: 'modal-header',
    template: `
        <div class="modal-header" [ngClass]="getCssClasses()">
            <button *ngIf="showClose" type="button" class="close" [ngClass]="getClosePosition()" 
            data-dismiss="modal" aria-label="Close" (click)="modal.dismiss()">
              <span aria-hidden="true">&times;</span>
            </button>           
            <ng-content></ng-content>
        </div>
    `
})
export class ModalHeaderComponent {
  @Input('show-close') showClose: boolean = false;
  @Input() ('close-position') closePosition: string = '';
  @Input() cssClass: string = '';

  constructor(private modal: HdModalComponent) { }

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
