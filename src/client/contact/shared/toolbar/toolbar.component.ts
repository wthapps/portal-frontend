import { Component, OnInit, HostBinding } from '@angular/core';
import { ZContactService } from '../services/contact.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-contact-shared-toolbar',
  templateUrl: 'toolbar.component.html',
  styleUrls: ['toolbar.component.css']
})
export class ZContactSharedToolbarComponent implements OnInit {
  @HostBinding('class') cssClass = 'page-body-control';

  constructor(private contactService: ZContactService) {
  }

  ngOnInit() {
    //
  }

  openAddModal() {
    console.log("openAddModal");
    this.contactService.contactAddContactService.sendIn({action: "open"});
  }
}
