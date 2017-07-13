import { Component, OnInit, ViewChild } from '@angular/core';
import { ZContactService } from '../../shared/services/contact.service';
import { ActivatedRoute, Params } from '@angular/router';
import { ContactAddLabelModalComponent } from '../../shared/modal/contact-add-label/contact-add-label-modal.component';

@Component({
  moduleId: module.id,
  selector: 'z-contact-detail',
  templateUrl: 'contact-detail.component.html'
})
export class ZContactDetailComponent implements OnInit {
  @ViewChild('modal') modal: ContactAddLabelModalComponent;

  contact: any;

  profileConfig: any = {
    onEditCustomUrl: 'contact/contacts',
    getCurrentUser: false,
    aboutComponent: false,
    workComponent: false,
    hobbyComponent: false
  };


  constructor(private contactService: ZContactService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      //
      console.log('current contact id:::::', params['id']);
      this.getContact(params['id']);
    });
  }


  private getContact(id: number) {
    this.contactService.get(id).subscribe((response: any) => {
      this.contact = response.data;
    });
  }
}
