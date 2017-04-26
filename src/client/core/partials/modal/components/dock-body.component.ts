import { Component } from '@angular/core';

import { ModalDockComponent } from '../dock.component';

@Component({
  moduleId: module.id,
  selector: 'wth-modal-dock-body',
  template: `
        <div class="modal-dock-body" *ngIf="!modalDock.collapse">
            <ng-content></ng-content>
        </div>
    `,
  styleUrls: ['dock-body.component.css']
})

export class ModalDockBodyComponent {
  constructor(private modalDock: ModalDockComponent) {
  }
}
