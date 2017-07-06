import { Component, OnInit } from '@angular/core';
import { ZContactService } from '../../shared/services/contact.service';

@Component({
  moduleId: module.id,
  selector: 'z-contact-detail',
  templateUrl: 'contact-detail.component.html'
})
export class ZContactDetailComponent implements OnInit {
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
