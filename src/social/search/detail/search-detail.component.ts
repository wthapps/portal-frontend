import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { SocialService } from '../../shared/services/social.service';
import { ServiceManager, UrlService, AuthService } from '@wth/shared/services';
import { combineLatest } from 'rxjs/operators';

declare let _: any;

@Component({
  selector: 'z-social-search-detail',
  templateUrl: 'search-detail.component.html',
  styleUrls: ['../search.component.scss'],
  encapsulation: ViewEncapsulation.None})

export class ZSocialSearchResultDetailComponent implements OnDestroy {
  show: boolean = false;
  type: string = '';
  result: any;
  group: any;
  groups: any;
  showMore: boolean = false;
  sub: any;
  favourite: any; // toggle favourites status for members, communities

  searchPostedBy: string = '';
  searchDate: string = '';
  events: any;
  show_more_posts: any;
  params: any;
  filter: any;
  filterDate: any;
  nextLink: any;

  showNavSearch:boolean = true;
  term: string = '';
  loading: boolean;

  constructor(private router: Router,
              private route: ActivatedRoute,
              public serviceManager: ServiceManager,
              public authService: AuthService,
              private urlService: UrlService,
              private socialService: SocialService) {
    this.route.paramMap.pipe(
      combineLatest(this.route.queryParamMap)
    ) .subscribe(([paramMap, queryParamMap]) => {
      this.group = paramMap.get('group').split(';')[0];
      this.term = this.group;
      this.params = paramMap.get('q') || queryParamMap.get('q');
      this.filter = paramMap.get('filter_post') || queryParamMap.get('filter_post');
      this.filterDate = paramMap.get('filter_date') || queryParamMap.get('filter_date');
      if (this.params) {
        let query: any = {q: this.params};
        if (this.filter) {
          query.filter = this.filter;
        }
        if (this.filterDate) {
          query.filter_date = this.filterDate;
        }
        this.loading = true;
        this.serviceManager.getApi().get(`zone/social_network/search/${this.group}`, query).subscribe(
          (res: any) => {
            this.loading = false;
            this.result = res.data;
            this.groups = Object.keys(this.result);
            this.nextLink = res.page_metadata.links.next;
          },
          err => this.loading = false
        );
      }
    });

    this.route.fragment.subscribe((f: any) => {
      this.showNavSearch = !(f=='detail');
    });

  }

  ngOnDestroy() {
    this.events && this.events.unsubscribe();
  }

  onFilter(e) {
    console.debug('on filter: ', e, this.route);
    const queryParams = {...this.route.snapshot.queryParams, ...e};
    this.router.navigate([this.route.snapshot.params], {queryParams, relativeTo: this.route});
  }

  onLoadMore() {
    if (this.nextLink) {
      this.serviceManager.getApi().get(this.nextLink).subscribe(
        (res: any) => {
          // _.map(res.data, (v: any)=> {
          //   this.result.push(v);
          // });
          this.result = [...this.result, ...res.data];
          this.nextLink = res.page_metadata.links.next;
        }
      );
    }
  }
}
