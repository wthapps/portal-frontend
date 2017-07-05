import { Component, OnInit } from '@angular/core';
import { ZContactService } from '../shared/services/contact.service';

@Component({
  moduleId: module.id,
  selector: 'z-contact-list',
  templateUrl: 'contact-list.component.html'
})
export class ZContactListComponent implements OnInit {
  data: any = [];

  constructor(private contactService: ZContactService) {
  }

  ngOnInit() {
    this.contactService.getContactList().subscribe(
      (res: any)=> {
        this.data = res.data;
      }
    )
  }
}
