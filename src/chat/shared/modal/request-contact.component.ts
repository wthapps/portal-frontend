import { Component, ViewChild, Output, EventEmitter } from '@angular/core';
import { BsModalComponent } from 'ng2-bs3-modal';
import { ChatContactService } from '@chat/shared/services/chat-contact.service';
import { ModalService } from '@shared/components/modal/modal-service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-chat-share-request-contact',
  templateUrl: 'request-contact.component.html'
})

export class ZChatShareRequestContactComponent {

  contact: any;
  message = 'Hello, I would like to connect with you on WTH!Chat!';
  @ViewChild('modal') modal: BsModalComponent;
  @Output() onClose: EventEmitter<any> = new EventEmitter<any>();

  constructor(private chatContactService: ChatContactService, private modalService: ModalService) {
    this.modalService.open$.subscribe(payload => {
      if (payload.modalName && payload.modalName === 'ChatRequestModal') {
        this.open(payload);
      }
    });
  }

  send() {
    this.chatContactService.addContact([this.contact.id], this.message);
    this.modal.close();
    this.onClose.emit();
  }

  open(options: any) {
    this.contact = options.contact;
    this.modal.open();
  }
}
