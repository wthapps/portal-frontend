import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { UserService } from '../../../shared/services/user.service';
import { Constants } from '../../../shared/config/constants';

declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'z-shared-menu',
  templateUrl: 'menu.component.html',
  styles: [`
    li.active {}
  `]
})

export class ZSharedMenuComponent implements OnInit {

  uuid: string;
  urls: any = [];
  items = Constants.pictureMenuItems;
  socialMenu = Constants.socialMenuItems;
  chatMenu = Constants.chatMenuItems;

  constructor(private router: Router,
              private userService: UserService) {
    // this.uuid = this.userService.profile?.uuid;
    this.uuid = this.userService.getProfileUuid();
  }

  ngOnInit() {
    this.router.events.subscribe((navigationEnd: NavigationEnd) => {
      this.urls.length = 0; //Fastest way to clear out array
      this.getMenuAction(navigationEnd.urlAfterRedirects ? navigationEnd.urlAfterRedirects : navigationEnd.url);
    });
  }

  getMenuAction(url: string): void {
    $('.page-menuleft .has-sub ul').addClass('hidden');
    let urlArr = url.split('/');
    console.log('menu url: ' + url);
    if (urlArr[2]) {
      // $('#zone_menu_' + urlArr[2]).removeClass('hidden');
    }
  }

  onMenu(event: any) {
    $(event.target.nextElementSibling).toggleClass('hidden');
  }

}
