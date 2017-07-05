import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Constants } from '../../../../core/shared/config/constants';
import { CountryService } from '../../../../core/partials/countries/countries.service';

@Component({
  moduleId: module.id,
  selector: 'z-contact-shared-item',
  templateUrl: 'item.component.html'
})
export class ZContactSharedItem implements OnInit {
  @Input() data: any;
  @Input() selected: boolean = false;
  @Output() unSelectedAll: EventEmitter<boolean> = new EventEmitter<boolean>();

  emailType: any = Constants.emailType;
  countriesCode: any;

  constructor(private countryService: CountryService) {
  }

  ngOnInit() {
    this.countryService.getCountries().subscribe(
      (res: any) => {
        this.countriesCode = res;
      });
  }

  onSelected() {
    this.selected = !this.selected;
    if (this.selected == false) {
      this.unSelectedAll.emit(true);
    }
  }
}
