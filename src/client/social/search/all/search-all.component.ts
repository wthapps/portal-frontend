import { Component, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ServiceManager } from '../../../core/shared/services/service-manager';
import { SocialService } from '../../shared/services/social.service';

@Component({
  moduleId: module.id,
  selector: 'z-social-search-all',
  templateUrl: 'search-all.component.html',
  styleUrls: ['search-all.component.css']
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

  constructor(private router: Router,
              public serviceManager: ServiceManager,
              private socialService: SocialService) {

    this.events = this.router.events
      .filter((event: any) => event instanceof NavigationEnd)
      .subscribe((event: NavigationEnd) => {
        let paths = event.url.toString().split('/')[1].split('?');
        if (paths[1]) {
          this.params = paths[1].substring(2, paths[1].length);
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
    this.events.unsubscribe();
  }
}
