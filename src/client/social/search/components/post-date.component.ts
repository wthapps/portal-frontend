import { Component, OnInit, OnDestroy } from '@angular/core';
import { UrlService } from '../../../core/shared/services/url.service';
import { Router } from '@angular/router';
import { DateService } from '../../../core/shared/services/date.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-social-post-date',
  templateUrl: 'post-date.component.html'
})

export class ZSocialPostDateFilterComponent {
  searchDate: string = '';
  searchDateValue: any;
  disableCustom:boolean = true;
  customDate:any = "*";

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
    let filterPost:any = "";
    if (this.urlService.getQuery()["filter_post"]) {
      filterPost = decodeURIComponent(this.urlService.getQuery()["filter_post"]);
    }
    let q = this.urlService.getQuery()["q"];
    let body:any = {};
    if (q) {
      body.q = q;
    }
    if (filterPost) {
      body.filter_post = filterPost;
    }
    if (filter) {
      body.filter_date = filter;
    }
    this.router.navigate([this.urlService.getPatch()], {queryParams: body});
  }

  convert() {
    if (this.searchDateValue) {
      this.customDate = this.dateService.getTimeString(this.searchDateValue);
    }
  }
}
