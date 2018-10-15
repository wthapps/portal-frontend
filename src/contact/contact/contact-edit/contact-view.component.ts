import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { Constants } from '../../../shared/constant/config/constants';
import { Observable } from 'rxjs/Observable';
import { CountryService } from '@shared/shared/components/countries/countries.service';
import { ZContactService } from '@contacts/shared/services/contact.service';

declare let _: any;

@Component({
  selector: 'contact-view',
  templateUrl: 'contact-view.component.html'
})
export class ZContactViewComponent {
  @Input() contact: any;

  readonly phoneCategories: any = Constants.phoneCategories;
  readonly emailCategories: any = Constants.emailCategories;
  readonly addressCategories: any = Constants.addressCategories;
  readonly mediaCategories: any = Constants.mediaCategories;

  countriesCode$: Observable<any>;

  constructor(
    public contactService: ZContactService,
    private countryService: CountryService) {
    this.countriesCode$ = this.countryService.countriesCode$;
  }


}
