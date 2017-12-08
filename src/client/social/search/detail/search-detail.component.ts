import { Component, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { ServiceManager } from '../../../core/shared/services/service-manager';
import { SocialService } from '../../shared/services/social.service';
import { UrlService } from '../../../core/shared/services/url.service';

declare let _: any;

@Component({
  moduleId: module.id,
  selector: 'z-social-search-detail',
  templateUrl: 'search-detail.component.html',
  styleUrls: ['search-detail.component.css']
})

export class ZSocialSearchResultDetailComponent implements OnDestroy {
  show: boolean = false;
  type: string = '';
  result: any;
  group: any;
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

  constructor(private router: Router,
              private route: ActivatedRoute,
              public serviceManager: ServiceManager,
              private urlService: UrlService,
              private socialService: SocialService) {

    this.events = this.router.events
      .filter((event: any) => event instanceof NavigationEnd)
      .subscribe((event: NavigationEnd) => {
        this.group = this.urlService.getId();
        this.params = this.urlService.getQuery()['q'];
        this.filter = this.urlService.getQuery()['filter_post'];
        this.filterDate = this.urlService.getQuery()['filter_date'];
        if (this.params) {
          let query: any = {q: this.params};
          if (this.filter) {
            query.filter = this.filter;
          }
          if (this.filterDate) {
            query.filter_date = this.filterDate;
          }
          this.serviceManager.getApi().get(`zone/social_network/search/${this.group}`, query).subscribe(
            (res: any) => {
              this.result = res.data;
              this.nextLink = res.page_metadata.links.next;
            }
          );
        }
      });
  }

  ngOnDestroy() {
    this.events.unsubscribe();
  }

  onLoadMore() {
    if (this.nextLink) {
      this.serviceManager.getApi().get(this.nextLink).subscribe(
        (res: any) => {
          _.map(res.data, (v: any)=> {
            this.result.push(v);
          });
          this.nextLink = res.page_metadata.links.next;
        }
      );
    }
  }
}
