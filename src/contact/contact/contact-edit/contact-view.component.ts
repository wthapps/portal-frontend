import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ZContactService } from '../../shared/services/contact.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { ContactAddGroupModalComponent } from '../../shared/modal/contact-add-group/contact-add-group-modal.component';
import { Constants } from '../../../shared/constant/config/constants';
import { _contact } from '../../shared/utils/contact.functions';
import { GroupService } from '../../group/group.service';
import { Observable } from 'rxjs/Observable';
import { CountryService } from '@shared/shared/components/countries/countries.service';

declare let _: any;

@Component({
  selector: 'contact-view',
  templateUrl: 'contact-view.component.html'
})
export class ZContactViewComponent {
  @Input() contact: any;

  phoneCategories: any = Constants.phoneCategories;
  emailCategories: any = Constants.emailCategories;
  addressCategories: any = Constants.addressCategories;
  mediaCategories: any = Constants.mediaCategories;
  _contact: any = _contact;

  countriesCode$: Observable<any>;

  constructor(private countryService: CountryService) {
    this.countriesCode$ = this.countryService.countriesCode$;
  }


}
