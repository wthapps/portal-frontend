import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { Constants } from '../../../../shared/constant/config/constants';
import { ZContactService } from '../../services/contact.service';
import { CommonEventService } from '../../../../shared/services/common-event/common-event.service';
import { CountryService } from '../../../../shared/shared/components/countries/countries.service';
import { Observable } from 'rxjs/Observable';
import { ApiBaseService } from '@shared/services';
import { Router } from '@angular/router';

@Component({

  selector: 'z-contact-shared-item',
  templateUrl: 'item.component.html'
})
export class ZContactSharedItemComponent implements OnInit {
  @Input() data: any;
  @HostBinding('class') cssClass = 'component-listbox-body';

  saved = false;

  emailType: any = Constants.emailType;
  countriesCode$: Observable<any>;

  constructor(
    private countryService: CountryService,
    private contactService: ZContactService,
    private apiBaseService: ApiBaseService,
    private router: Router,
    private commonEventService: CommonEventService
  ) {

    this.contactService.listenToList.subscribe((event: any) => {
      this.data.selected = event;
    });

  }

  ngOnInit() {
    this.countriesCode$ = this.countryService.countriesCode$;
  }

  onSelected() {
    this.data.selected = !this.data.selected;
    if (this.data.selected) {
      this.contactService.addItemSelectedObjects(this.data);
      this.cssClass = 'component-listbox-body active';
    } else {
      this.contactService.removeItemSelectedObjects(this.data);
      this.cssClass = 'component-listbox-body';
    }
  }

  saveContact() {
    this.commonEventService.broadcast({ channel: Constants.contactEvents.actionsToolbar, action: 'save', payload: this.data });
  }

  doActionsToolbar(e: any) {
    this.commonEventService.broadcast({channel: Constants.contactEvents.actionsToolbar, action: e.action, payload: this.data});
  }
}
