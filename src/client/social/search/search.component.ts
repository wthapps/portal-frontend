import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { ServiceManager } from '../../core/shared/services/service-manager';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-social-search',
  templateUrl: 'search.component.html'
})

export class ZSocialSearchResultComponent implements OnInit {
  show: boolean = false;
  type: string = '';
  result: any;
  groups: any;
  showMore: boolean = false;
  sub: any;

  constructor(private route: ActivatedRoute, public serviceManager: ServiceManager) {}

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      console.log(params);
    });
    this.serviceManager.getRouter().events.forEach((event: any) => {
      if(event instanceof NavigationEnd) {
        let paths = event.url.toString().split('/')[1].split('?');
        if (paths[1]) {
          let q = paths[1].substring(2, paths[1].length);
          this.serviceManager.getApi().post(`zone/social_network/search`, {q: q, types: ['user', 'community', 'post']}).subscribe(
            (res:any) => {
              this.result = res.data;
              this.groups = Object.keys(res.data);
              // this.groups = _.pull(this.groups, 'posts');
              console.log(this.result, this.groups);
            }
          );
        }
      }
    });
  }
}
