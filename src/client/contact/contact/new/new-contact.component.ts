import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ModalComponent } from 'ng2-bs3-modal/components/modal';

@Component({
  moduleId: module.id,
  selector: 'z-chat-new-contact',
  templateUrl: 'new-contact.component.html',
  styleUrls: ['new-contact.component.css']
})
export class ZNewContactComponent implements OnInit {
  profileConfig: any = {getCurrentUser: false, createNew: true, aboutComponent: false, workComponent: false, hobbyComponent: false, callApiAfterChange: false};
  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {

  }
}
