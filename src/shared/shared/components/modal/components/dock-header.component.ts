import { Component, Input } from '@angular/core';

import { ModalDockComponent } from '../dock.component';
import { Constants } from '../../../../constant/config/constants';

@Component({
    selector: 'wth-modal-dock-header',
  template: `<div class="modal-dock-header">
              <div class="modal-dock-header-title" (click)="toggleCollapse()">
                <i *ngIf="loading" class="fa fa-spinner fa-spin"></i>
                <i *ngIf="done" class="fa fa-check-circle"></i>
                <i *ngIf="failed" class="fa fa-exclamation-triangle"></i>
                <ng-content > </ng-content>
              </div>
              <div class="modal-dock-header-action">
                <ng-content select="[dock-header-action]"></ng-content>
                <i *ngIf="hasCloseIcon" class="fa fa-times" (click)="modalDock.close()"
                pTooltip="{{tooltip.close}}" tooltipPosition="top"></i>
              </div>
            </div>`,
  styleUrls: ['dock-header.component.scss']
})

export class ModalDockHeaderComponent {
  @Input() loading: boolean = false;
  @Input() done: boolean = false;
  @Input() failed: boolean = false;
  @Input() hasCloseIcon: boolean = true;
  @Input() hasCollapse: boolean = true;

  tooltip: any = Constants.tooltip;

  constructor(public modalDock: ModalDockComponent) {
  }

  toggleCollapse() {
    if(this.hasCollapse) this.modalDock.toggleCollapse();
  }
}
