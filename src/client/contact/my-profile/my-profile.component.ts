import { Component, ViewChild } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/components/modal';

@Component({
  moduleId: module.id,
  selector: 'z-chat-my-profile',
  templateUrl: 'my-profile.component.html',
  styleUrls: ['my-profile.component.css']
})
export class ZContactMyProfileComponent {
  @ViewChild('modal') modal: ModalComponent;

  constructor() {
  }
}
