import { Component, OnInit, ViewChild } from '@angular/core';
import { ZContactService } from '../../shared/services/contact.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { ContactAddLabelModalComponent } from '../../shared/modal/contact-add-label/contact-add-label-modal.component';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';
import { Constants } from '../../../core/shared/config/constants';
import { Label } from '../../label/label.model';
import { _contact } from "../../shared/functions/contact.functions";
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

  phoneCategories: any = Constants.phoneCategories;
  emailCategories: any = Constants.emailCategories;
  addressCategories: any = Constants.addressCategories;
  mediaCategories: any = Constants.mediaCategories;
  hasLabel: any = _contact.isContactsHasLabelName;

  constructor(private contactService: ZContactService, private route: ActivatedRoute, private apiBaseService: ApiBaseService, private router: Router) {
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      //
      console.log('current contact id:::::', params['id']);
      this.getContact(params['id']);
      this.contactId = params['id'];
    });
  }

  deleteContact() {
    this.contactService.confirmDeleteContact(this.data);
  }

  toggleLabel(name: string) {
    let label: any = name =='favourite' ? {id: 3} : {id: 6};

    if (_contact.isContactsHasLabelName([this.data], name)) {
      _contact.removeLabelContactsByName([this.data], name);
    } else {
      _contact.addLabelContacts([this.data], label);
    }
    this.contactService.update([this.data]).subscribe((res: any) => {
      this.data = res.data;
    });
  }

  doActionsToolbar(event: any) {
    if(event.action == 'favourite') {
      this.toggleLabel('favourite');
    }

    if(event.action == 'blacklist') {
      this.toggleLabel('blacklist');
    }

    if(event.action == 'delete') {
      this.contactService.confirmDeleteContacts([this.data]);
    }

    if(event.action == 'social') {
      if(this.data && this.data.wthapps_user && this.data.wthapps_user.uuid) {
        window.location.href = _contact.getSocialLink(this.data.wthapps_user.uuid);
      }
    }

    if(event.action == 'chat') {
      if(this.data && this.data.wthapps_user && this.data.wthapps_user.uuid) {
        window.location.href = _contact.getChatLink(this.data.wthapps_user.uuid);
      }
    }

    if(event.action == 'edit_contact') {
      this.router.navigate(['contacts/', this.data.id, {mode: 'edit'}]).then();
    }
  }


  private getContact(id: number) {
    this.contactService.get(id).subscribe((response: any) => {
      this.data = response.data;
    });
  }
}
