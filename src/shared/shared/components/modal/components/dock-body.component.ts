import { Component } from '@angular/core';

import { ModalDockComponent } from '../dock.component';

@Component({
    selector: 'wth-modal-dock-body',
  template: `
        <!--<div class="modal-dock-body" *ngIf="!modalDock.collapse">-->
        <div class="modal-dock-body" *ngIf="!modalDock.collapse">
            <ng-content></ng-content>
        </div>
    `,
  styleUrls: ['dock-body.component.scss']
})

export class ModalDockBodyComponent {
  constructor(public modalDock: ModalDockComponent) {
  }
}
