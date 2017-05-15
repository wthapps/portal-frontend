import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../../core/shared/services/user.service';
import { Router, NavigationEnd } from '@angular/router';
import { UrlService } from '../../../core/shared/services/url.service';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-social-post-by',
  templateUrl: 'post-by.component.html'
})

export class ZSocialPostByFilterComponent implements OnInit {
  searchPostedBy: string = '';
  url:any;
  disableCustom:boolean = true;
  suggestions:any;
  searchText:any;
  ownerId:any;

  constructor(
    private userService: UserService,
    private urlService: UrlService,
    private apiBaseService: ApiBaseService,
    private router: Router,
  ) {

  }

  ngOnInit() {
  //
  }

  disable(disableCustom:boolean) {
    this.disableCustom = disableCustom;
    if (disableCustom) {
      this.searchText = '';
    }
  }

  filter(filter:any) {
    let filterDate = '';
    if (this.urlService.getQuery()['filter_date']) {
      filterDate = decodeURIComponent(this.urlService.getQuery()['filter_date']);
    }
    let q = this.urlService.getQuery()['q'];
    let body:any = {};
    if (q) {
      body.q = q;
    }
    if (filterDate) {
      body.filter_date = filterDate;
    }
    if (filter) {
      body.filter_post = filter;
    }
    this.router.navigate([this.urlService.getPatch()], {queryParams: body});
  }

  getSuggestions(e:any) {
    this.suggestions = [];
    this.apiBaseService.get(`zone/social_network/search/get_following_by_key`, {q: this.searchText}).subscribe((res:any) => {
      this.suggestions = res.data;
    });
  }

  onSelect(e:any) {
    console.log(e);
    this.ownerId = e.id;
  }
}
