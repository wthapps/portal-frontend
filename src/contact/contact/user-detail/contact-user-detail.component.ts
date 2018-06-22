import { Component, OnInit, ViewChild } from '@angular/core';
import { ZContactService } from '../../shared/services/contact.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { ContactAddGroupModalComponent } from '../../shared/modal/contact-add-group/contact-add-group-modal.component';
import { ApiBaseService } from '../../../shared/services/apibase.service';
import { Constants } from '../../../shared/constant/config/constants';
import { _contact } from '../../shared/utils/contact.functions';
import { GroupService } from '../../group/group.service';
import { Observable } from 'rxjs/Observable';
import { CountryService } from '@shared/shared/components/countries/countries.service';
import { CommonEventService } from '@shared/services';

declare let _: any;

@Component({
  selector: 'z-contact-user-detail',
  templateUrl: 'contact-user-detail.component.html'
})
export class ZContactUserDetailComponent implements OnInit {
  @ViewChild('modal') modal: ContactAddGroupModalComponent;
  contactId: number;
  data: any;

  phoneCategories: any = Constants.phoneCategories;
  emailCategories: any = Constants.emailCategories;
  addressCategories: any = Constants.addressCategories;
  mediaCategories: any = Constants.mediaCategories;
  _contact: any = _contact;

  countriesCode$: Observable<any>;

  constructor(private contactService: ZContactService,
              private route: ActivatedRoute,
              private apiBaseService: ApiBaseService,
              private groupService: GroupService,
              private router: Router,
              private commonEventService: CommonEventService,
              private countryService: CountryService) {
    this.countriesCode$ = this.countryService.countriesCode$;
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.getContact(params['id']);
      this.contactId = params['id'];
    });
  }

  toggleGroup(name: string) {
    let group = _.find(this.groupService.getAllGroupSyn(), (group: any) => {
      return group.name == name;
    });

    if (_contact.isContactsHasGroupName([this.data], name)) {
      _contact.removeGroupContactsByName([this.data], name);
    } else {
      _contact.addGroupContacts([this.data], group);
    }
    this.contactService.update([this.data]).subscribe((res: any) => {
      this.data = res.data;
    });
  }

  doActionsToolbar(event: any) {
    if (event.action == 'favourite') {
      this.toggleGroup('favourite');
    }

    if (event.action == 'blacklist') {
      this.toggleGroup('blacklist');
    }

    if (event.action == 'delete') {
      this.contactService.confirmDeleteContacts([this.data]);
    }

    if (event.action == 'edit_contact') {
      this.router.navigate(['contacts/', this.data.id, {mode: 'edit'}]).then();
    }
  }

  save() {
    this.apiBaseService.post(`contact/contacts/save`, this.data).subscribe(res => {
      this.contactService.createCallback(res.data);
      this.router.navigate(['contacts', res.data.id, {mode: 'view'}]);
    })
  }


  private getContact(id: number) {
    this.apiBaseService.get(`contact/contacts/show_user`, {id: id}).subscribe(res => {
      this.data = res.data;
    })
  }
}
