import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/components/modal';

@Component({
  selector: 'app-partials-notification-setting-modal',
  templateUrl: 'modal.component.html'
})

export class NotificationSettingModalComponent implements OnInit {
  @ViewChild('modal') modal: ModalComponent;

  social: Boolean = false;
  chat: Boolean = false;
  note: Boolean = false;

  ngOnInit(): void {
  }

  open() {
    this.modal.open();
  }

  onSave() {
    console.log(this.social, this.chat, this.note);
  }

}
