import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalComponent } from 'ng2-bs3-modal/components/modal';

@Component({
  moduleId: module.id,
  selector: 'z-medial-my-profile',
  templateUrl: 'my-profile.component.html',
  styleUrls: ['my-profile.component.css']
})
export class ZMediaMyProfileComponent {
  @ViewChild('modal') modal: ModalComponent;

  constructor(private route: ActivatedRoute) {
  }

  onOpen(user: any) {
    this.modal.open();
  }
}
