import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { DateService, UrlService } from '@wth/shared/services';

@Component({
  selector: 'z-social-post-date',
  templateUrl: 'post-date.component.html'
})
export class ZSocialPostDateFilterComponent {
  @Output() filterEvent: EventEmitter<any> = new EventEmitter();

  searchDate: string = '';
  searchDateValue: any;
  disableCustom:boolean = true;
  customDate:any = '*';

  constructor(
    private urlService: UrlService,
    private dateService: DateService,
    private router: Router,
  ) {

  }

  disable(disableCustom:boolean) {
    this.disableCustom = disableCustom;
  }

  filter(filter:any) {
    this.filterEvent.emit({filter_date: filter});
  }

  convert() {
    if (this.searchDateValue) {
      this.customDate = this.dateService.getTimeString(this.searchDateValue);
    }
  }
}
