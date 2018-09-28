import { Component, OnInit, ViewChild } from '@angular/core';
import { Constants } from '@shared/constant';
import { BsModalComponent } from 'ng2-bs3-modal';

@Component({
  selector: 'invite-contact',
  templateUrl: './invite-contact.component.html',
  styleUrls: ['./invite-contact.component.css']
})
export class InviteContactComponent implements OnInit {
  @ViewChild('modal') modal: BsModalComponent;

  ngOnInit() {}

  openModal() {
    this.modal.open();
  }
}
