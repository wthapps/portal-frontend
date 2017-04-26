import { Component, Input } from '@angular/core';

import { ModalDockComponent } from '../dock.component';

@Component({
  moduleId: module.id,
  selector: 'wth-modal-dock-header',
  template: `
        <div class="modal-dock-header">
          <div class="modal-dock-header-title" (click)="modalDock.toggleCollapse()">
            <i *ngIf="loading" class="fa fa-spinner fa-spin"></i> <ng-content></ng-content>
          </div>
          <div class="modal-dock-header-action">
            <i class="fa fa-times" (click)="modalDock.close()"></i>
          </div>
        </div>
    `,
  styleUrls: ['dock-header.component.css']
})

export class ModalDockHeaderComponent {
  @Input() loading: boolean = false;

  constructor(private modalDock: ModalDockComponent) {
  }
}
