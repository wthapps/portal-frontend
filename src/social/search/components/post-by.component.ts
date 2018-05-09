import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ApiBaseService, UrlService, UserService } from '@wth/shared/services';

@Component({
  selector: 'z-social-post-by',
  templateUrl: 'post-by.component.html'
})
export class ZSocialPostByFilterComponent implements OnInit {
  @Output() filterEvent: EventEmitter<any> = new EventEmitter();

  searchPostedBy: string = '';
  url:any;
  disableCustom:boolean = true;
  suggestions:any;
  searchText:any;
  ownerId:any;

  constructor(
    public userService: UserService,
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
    this.filterEvent.emit({filter_post: filter});
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
