import { Component, Input } from '@angular/core';

import { ModalDockComponent } from '../dock.component';

@Component({
    selector: 'wth-modal-dock-footer',
  template: `<div class="modal-dock-footer" *ngIf="!modalDock.collapse" [ngClass]="{'modal-dock-footer-inline': inline}">
                <div class="modal-dock-footer-action"><ng-content></ng-content></div>
              </div>`,
  styleUrls: ['dock-footer.component.scss']
})

export class ModalDockFooterComponent {
  @Input() inline: any = false;

  constructor(public modalDock: ModalDockComponent) {
  }
}
