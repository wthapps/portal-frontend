import { Component, OnInit } from '@angular/core';
import { ApiBaseServiceV2 } from '../../../../shared/services/apibase.service.v2';
import { UserService } from '../../../../shared/services/user.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-social-community-detail-post',
  templateUrl: 'post.component.html'
})

export class ZSocialCommunityDetailPostComponent implements OnInit {

  errorMessage: string = '';
  urls: any;
  uuid: string = 'e4f50394-06d5-428c-b243-58d9d7594489';

  constructor(private apiBaseServiceV2: ApiBaseServiceV2,
              private route: ActivatedRoute,
              private router: Router,
              private userService: UserService) {

    this.urls = new Array();
    this.router.events.subscribe((navigationEnd: NavigationEnd) => {
      this.urls.length = 0; //Fastest way to clear out array
      this.getUUID(navigationEnd.urlAfterRedirects ? navigationEnd.urlAfterRedirects : navigationEnd.url);
    });

  }

  ngOnInit() {
    this.apiBaseServiceV2.get(`/zone/social_network/communities/${this.uuid}`).subscribe(
      (res: any)=> {
        console.log(res.data);
      },
      error => this.errorMessage = <any>error
    );
  }


  getUUID(url: string): void {
    this.urls.unshift(url); //Add url to beginning of array (since the url is being recursively broken down from full url to its parent)
    if (url.lastIndexOf('/') > 0) {
      this.getUUID(url.substr(0, url.lastIndexOf('/'))); //Find last '/' and add everything before it as a parent route
    }
    let _this = this;
    this.uuid = _.last(_this.urls[3].split('/'));
  }

}
