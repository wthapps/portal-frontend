import { Component, OnInit } from '@angular/core';
import {
  Router,
  NavigationEnd
} from '@angular/router';

import { Constants } from "../../../shared/config/constants";
import { UserService } from '../../../shared/services/user.service';


declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'zone-menu',
  templateUrl: 'menu.component.html',
  styles: [`
    li.active {}
  `]
})

export class ZoneMenuComponent implements OnInit {

  uuid: string;
  urls: any = [];
  items = Constants.pictureMenuItems;
  socialMenu = Constants.socialMenuItems;

  constructor(private router: Router,
              private userService: UserService) {
    this.uuid = this.userService.profile.uuid;
  }

  ngOnInit() {
    this.router.events.subscribe((navigationEnd: NavigationEnd) => {
      this.urls.length = 0; //Fastest way to clear out array
      // this.getNavTitle(navigationEnd.urlAfterRedirects ? navigationEnd.urlAfterRedirects : navigationEnd.url);
      this.getMenuAction(navigationEnd.urlAfterRedirects ? navigationEnd.urlAfterRedirects : navigationEnd.url);
    });
  }

  getMenuAction(url: string): void {
    $('.page-menuleft .has-sub ul').addClass('hidden');
    let urlArr = url.split("/");
    if (urlArr[2]) {
      $('#zone_menu_' + urlArr[2]).removeClass('hidden');
    }
  }

  getNavTitle(url: string): void {
    this.urls.unshift(url); //Add url to beginning of array (since the url is being recursively broken down from full url to its parent)
    if (url.lastIndexOf('/') > 0) {
      this.getNavTitle(url.substr(0, url.lastIndexOf('/'))); //Find last '/' and add everything before it as a parent route
    }
    if (this.urls[1] == '/zone/picture') {
      $('#zone_menu_picture').parent('.has-sub').addClass('active');
      $('#zone_menu_picture').removeClass('hidden');
    } else if (this.urls[1] == '/zone/social') {
      $('#zone_menu_social').parent('.has-sub').addClass('active');
      $('#zone_menu_social').removeClass('hidden');
    }
  }

  onMenu(event: any) {
    $(event.target.nextElementSibling).toggleClass('hidden');
  }

}
