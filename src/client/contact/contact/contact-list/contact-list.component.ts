import { Component, OnInit } from '@angular/core';
import { ZContactService } from '../../shared/services/contact.service';
import { ActivatedRoute, Params } from '@angular/router';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-contact-list',
  templateUrl: 'contact-list.component.html'
})
export class ZContactListComponent implements OnInit {
  data: any = [];

  constructor(private contactService: ZContactService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      console.log(params);
    });


    this.contactService.getContactList().subscribe(
      (res: any)=> {
        this.data = res.data;
      }
    )
  }

  onDeleteAll() {
    console.log('delete all');
    console.log(this.contactService.selectedObjects);
  }
}
