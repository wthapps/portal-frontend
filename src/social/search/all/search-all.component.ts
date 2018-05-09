import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiBaseService, ServiceManager, AuthService } from '@wth/shared/services';
import { debounceTime, throttleTime, combineLatest } from 'rxjs/operators';

@Component({
  selector: 'z-social-search-all',
  templateUrl: 'search-all.component.html',
  styleUrls: ['../search.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ZSocialSearchResultAllComponent implements OnDestroy {
  show: boolean = false;
  type: string = '';
  result: any;
  groups: any;
  sub: any;
  favourite: any; // toggle favourites status for members, communities

  events: any;
  show_more_posts: any;
  show_more_communities: any;
  show_more_members: any;
  params: any;
  term: string = 'all';
  loading: boolean = true;

  constructor(private route: ActivatedRoute, private router: Router, private api: ApiBaseService,
              public authService: AuthService ) {
      this.sub = this.route.paramMap.pipe(
        combineLatest(this.route.queryParamMap)
      ).subscribe(([paramMap, queryParamMap]) => {
      this.params = paramMap.get('q') || queryParamMap.get('q');
      if (this.params) {
        this.loading = true;
        this.api.post(`zone/social_network/search`, {
          q: this.params,
          types: ['members', 'communities', 'posts']
        }).subscribe(
          (res: any) => {
            this.loading = false;
            this.result = res.data;
            this.groups = Object.keys(res.data);
            if (res.show_more_posts) {
              this.show_more_posts = res.show_more_posts;
            }
            if (res.show_more_communities) {
              this.show_more_communities = res.show_more_communities;
            }
            if (res.show_more_members) {
              this.show_more_members = res.show_more_members;
            }
          },
          err => this.loading = false
        );
      }
    });
  }

  navigateTo(routes: string) {
    this.router.navigate(['../', routes], { relativeTo: this.route, queryParams: {q: this.params}});

  }

  ngOnDestroy() {
    this.sub && this.sub.unsubscribe();
  }
}
