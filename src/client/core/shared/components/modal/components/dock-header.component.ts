import { Component, Input } from '@angular/core';

import { ModalDockComponent } from '../dock.component';

@Component({
  moduleId: module.id,
  selector: 'wth-modal-dock-header',
  template: `<div class="modal-dock-header">
              <div class="modal-dock-header-title" (click)="modalDock.toggleCollapse()">
                <i *ngIf="loading" class="fa fa-spinner fa-spin"></i>
                <i *ngIf="done" class="fa fa-check-circle"></i>
                <i *ngIf="failed" class="fa fa-exclamation-triangle"></i>
                <ng-content> </ng-content>
              </div>
              <div class="modal-dock-header-action">
                <i class="fa fa-times" (click)="modalDock.close()"></i>
              </div>
            </div>`,
  styleUrls: ['dock-header.component.css']
})

export class ModalDockHeaderComponent {
  @Input() loading: boolean = false;
  @Input() done: boolean = false;
  @Input() failed: boolean = false;

  constructor(public modalDock: ModalDockComponent) {
  }
}
