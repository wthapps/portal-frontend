import { Component, ViewChild } from '@angular/core';
import { BsModalComponent } from 'ng2-bs3-modal';

@Component({
  moduleId: module.id,
  selector: 'me-modal-list',
  templateUrl: 'media-modal-list.component.html'
})
export class MediaModalListComponent {
  @ViewChild('modal') modal: BsModalComponent;

  open() {
    this.modal.open();
  }
  close() {
    this.modal.close();
  }
}
