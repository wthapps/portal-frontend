import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { Constants } from '../../../core/shared/config/constants';
import { UserService } from '../../../core/shared/services/user.service';

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
    this.uuid = this.userService.profile.uuid;
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
    if (urlArr[2]) {
      $('#zone_menu_' + urlArr[2]).removeClass('hidden');
    }
  }

  onMenu(event: any) {
    $(event.target.nextElementSibling).toggleClass('hidden');
  }

}
