import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { UserService } from '../../../shared/services/user.service';
import { Constants } from '../../../shared/config/constants';
import { WTHNavigateService } from '../../../shared/services/wth-navigate.service';

declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'z-shared-menu',
  templateUrl: 'menu.component.html'
})

export class ZSharedMenuComponent implements OnInit {

  uuid: string;
  urls: any;
  mediaMenu = Constants.pictureMenuItems;
  socialMenu = Constants.socialMenuItems;
  chatMenu = Constants.chatMenuItems;
  hostname: string = '';
  isProfileTab: boolean;

  constructor(private userService: UserService,
              private route: ActivatedRoute,
              private router: Router,
              private navigateService: WTHNavigateService,
              private location: Location) {
    this.uuid = this.userService.getProfileUuid();
    this.urls = Constants.baseUrls;
  }

  ngOnInit() {
    let currentUrl = this.router.url; /// this will give you current url
    this.hostname = window.location.origin;
    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe((event: any) => {
        if (event.url.indexOf('profile') !== -1) {
          this.isProfileTab = true;
        } else {
          this.isProfileTab = false;
        }
      });
    // your logic to know if its my home page.
  }

  onMenu(event: string) {

    this.navigateService.navigateOrRedirect('', event);
    // $(event.target.nextElementSibling).toggleClass('hidden');
  }

  trackByFn() {

  }

}
