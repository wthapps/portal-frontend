import { Component, OnInit, ViewChild } from '@angular/core';
import { ZContactService } from '../../services/contact.service';
import { ModalComponent } from 'ng2-bs3-modal/components/modal';

@Component({
  moduleId: module.id,
  selector: 'z-contact-share-add-contact',
  templateUrl: 'add-contact.component.html'
})

export class ZContactShareAddContactComponent implements OnInit {
  @ViewChild('modal') modal: ModalComponent;

  constructor(private contactService: ZContactService) {

  }

  ngOnInit() {
    this.contactService.contactAddContactService.eventIn.subscribe((event: any) => {
      if(event.action == 'open') {
        this.modal.open();
      }
    });
  }

  add() {
    this.modal.close();
    this.contactService.addContact({name: "test"}).subscribe((res: any) => {
      this.contactService.contactAddContactService.sendOut(res);
    });
  }
}
