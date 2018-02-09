import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { BsModalComponent } from 'ng2-bs3-modal';

@Component({
  moduleId: module.id,
  selector: 'z-contact-share-icloud-indicate',
  templateUrl: 'icloud-indicate.component.html'
})

export class ZContactShareIcloudIndicateComponent {
  @ViewChild('modal') modal: BsModalComponent;
  event: EventEmitter<any> = new EventEmitter();

  open() {
    this.modal.open();
  }

  close() {
    this.event.emit();
  }
}
