import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { SoSearchService } from '../../../partials/header/sub/social-search.service';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-social-search',
  templateUrl: 'search.component.html'
})

export class ZSocialSearchResultComponent implements OnInit {
  show: boolean = false;
  type: string = '';
  searchService: any;
  result: any;
  groups: any;
  showMore: boolean = false;
  text: any = '';

  constructor(private route: ActivatedRoute, private socialSearchService: SoSearchService) {}

  ngOnInit() {

    this.route.params.subscribe((params: any) => {
      this.socialSearchService.search(params.text, ['user', 'community', 'post']).subscribe(
        (res:any) => {
          this.result = res.data;
          this.groups = Object.keys(res.data);
          this.groups = _.pull(this.groups, 'posts');
          console.log(res);
        }
      );
      // this.urls.length = 0; //Fastest way to clear out array
      // this.getNavTitle(navigationEnd.urlAfterRedirects ? navigationEnd.urlAfterRedirects : navigationEnd.url);
    });
  }
}
