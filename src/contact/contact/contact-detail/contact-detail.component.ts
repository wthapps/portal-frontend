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
import { ToastsService } from '@shared/shared/components/toast/toast-message.service';

declare let _: any;

@Component({
  selector: 'z-contact-detail',
  templateUrl: 'contact-detail.component.html'
})
export class ZContactDetailComponent implements OnInit {
  @ViewChild('modal') modal: ContactAddGroupModalComponent;
  contactId: number;
  data: any;

  readonly phoneCategories: any = Constants.phoneCategories;
  readonly emailCategories: any = Constants.emailCategories;
  readonly addressCategories: any = Constants.addressCategories;
  readonly mediaCategories: any = Constants.mediaCategories;
  _contact: any = _contact;

  countriesCode$: Observable<any>;

  constructor(private contactService: ZContactService,
              private route: ActivatedRoute,
              private groupService: GroupService,
              private router: Router,
              private countryService: CountryService,
              private toaster: ToastsService
  ) {
    this.countriesCode$ = this.countryService.countriesCode$;
  }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.contactService.clearSelected();
      this.getContact(params['id']);
      this.contactId = params['id'];
    });
  }

  toggleGroup(name: string) {
    const group = _.find(this.groupService.getAllGroupSyn(), (g: any) => {
      return g.name === name;
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
    switch (event.action) {
      case 'favourite':
        this.toggleGroup('favourite');
        break;

      case 'blacklist':
        this.toggleGroup('blacklist');
        break;

      case 'delete':
          this.contactService.confirmDeleteContacts([this.data]);
        break;

      case 'social':
        if (this.data && this.data.wthapps_user && this.data.wthapps_user.uuid) {
          window.location.href = _contact.getSocialLink(this.data.wthapps_user.uuid);
        }
        break;

      case 'chat':
        if (this.data && this.data.wthapps_user && this.data.wthapps_user.uuid) {
          window.location.href = _contact.getChatLink(this.data.wthapps_user.uuid);
        }
        break;

      case 'edit_contact':
        this.router.navigate(['contacts/', this.data.id, {mode: 'edit'}]).then();
        break;

      // case 'add_to_contacts':
      //   if (this.contactService.selectedObjects.length > 0) {
      //     const contacts = this.contactService.selectedObjects.map(contact => {
      //       contact.my_contact = true;
      //       return { ...contact };
      //     });
      //     this.contactService.updateMultiple({contacts: contacts}).subscribe(response => {
      //       this.toaster.success('You added others to your contacts successful!');
      //     });
      //   }
      //   break;
    }
  }


  private getContact(id: number): void {
    this.contactService.getIdLocalThenNetwork(id)
      .subscribe(ct => this.data = Object.assign({}, ct));
  }
}
