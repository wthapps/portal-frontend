import { Component, OnInit, ViewChild } from '@angular/core';
import { ZContactService } from '../../shared/services/contact.service';
import { ActivatedRoute, Params } from '@angular/router';

import { ContactAddLabelModalComponent } from '../../shared/modal/contact-add-label/contact-add-label-modal.component';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';
import { Constants } from '../../../core/shared/config/constants';
import { Label } from '../../label/label.model';

declare let _: any;

@Component({
  moduleId: module.id,
  selector: 'z-contact-detail',
  templateUrl: 'contact-detail.component.html'
})
export class ZContactDetailComponent implements OnInit {
  @ViewChild('modal') modal: ContactAddLabelModalComponent;
  contactId: number;
  data: any;
  labels: Label[];

  phoneCategories: any = Constants.phoneCategories;
  emailCategories: any = Constants.emailCategories;
  addressCategories: any = Constants.addressCategories;
  mediaCategories: any = Constants.mediaCategories;

  constructor(private contactService: ZContactService, private route: ActivatedRoute, private apiBaseService: ApiBaseService) {
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      //
      console.log('current contact id:::::', params['id']);
      this.getContact(params['id']);
      this.contactId = params['id'];
    });
  }

  doEvent(e: any) {
    console.log(e);
    this.contactService.update(this.data).subscribe((res: any) => {
      this.data = res.data;
      this.labels = _.map(this.data, 'name');
    });
  }

  deleteContact() {
    this.contactService.confirmDeleteContact(this.data);
  }


  private getContact(id: number) {
    this.contactService.get(id).subscribe((response: any) => {
      this.data = response.data;
      this.labels = _.map(this.data.labels, 'name');
      console.log('this.labels: ', this.labels);
    });
  }
}
