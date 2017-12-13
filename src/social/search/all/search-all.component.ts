import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ServiceManager } from '@wth/shared/services';

@Component({
  moduleId: module.id,
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

  constructor(private route: ActivatedRoute,
              public serviceManager: ServiceManager) {

    this.sub = this.route.queryParams.subscribe((params: any) => {
      this.params = params['q'];
      console.log(this.params);

      if (this.params) {
        this.serviceManager.getApi().post(`zone/social_network/search`, {
          q: this.params,
          types: ['member', 'community', 'post']
        }).subscribe(
          (res: any) => {
            console.log(res);
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
          }
        );
      }

    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
