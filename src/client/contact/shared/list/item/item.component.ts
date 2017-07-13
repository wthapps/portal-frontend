import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { Constants } from '../../../../core/shared/config/constants';
import { CountryService } from '../../../../core/partials/countries/countries.service';
import { ZContactService } from '../../services/contact.service';
import { CommonEventService } from '../../../../core/shared/services/common-event/common-event.service';

@Component({
  moduleId: module.id,
  selector: 'z-contact-shared-item',
  templateUrl: 'item.component.html',
  styleUrls: ['contact-item.css']
})
export class ZContactSharedItemComponent implements OnInit {
  @Input() data: any;
  @HostBinding('class') cssClass:string = 'contact-listbox-row';

  selected: boolean = false;

  emailType: any = Constants.emailType;
  countriesCode: any;

  constructor(
    private countryService: CountryService,
    private contactService: ZContactService,
    private commonEventService: CommonEventService
  ) {

    this.contactService.listenToList.subscribe((event: any) => {
      this.selected = event;
    });

  }

  ngOnInit() {
    this.countryService.getCountries().subscribe(
      (res: any) => {
        this.countriesCode = res;
      });
  }

  onSelected() {
    this.selected = !this.selected;
    if (this.selected) {
      this.contactService.addItemSelectedObjects(this.data);
      this.cssClass = 'contact-listbox-row active';
    } else {
      this.contactService.removeItemSelectedObjects(this.data);
      this.cssClass = 'contact-listbox-row';
    }
  }

  viewContactDetail() {
    this.commonEventService.broadcast({action: 'contact:contact:view_detail', payload: {item: 123456}})
  }
}
