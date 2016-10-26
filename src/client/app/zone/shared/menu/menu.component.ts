import { Component, AfterViewInit } from '@angular/core';
import {
  Router,
  NavigationEnd
} from '@angular/router';
import {Constants} from "../../../shared/config/constants";

declare var $: any;

@Component({
  moduleId: module.id,
  selector: 'zone-menu',
  templateUrl: 'menu.component.html',
  styles: [`
    li.active {}
  `]
})

export class ZoneMenuComponent implements AfterViewInit {

  urls: any;
  items = Constants.pictureMenuItems;

  constructor(private router: Router) {

    //console.log(this.userService);
    this.urls = new Array();
  }

  ngAfterViewInit() {
    this.router.events.subscribe((navigationEnd: NavigationEnd) => {
      this.urls.length = 0; //Fastest way to clear out array
      this.getNavTitle(navigationEnd.urlAfterRedirects ? navigationEnd.urlAfterRedirects : navigationEnd.url);
    });
  }

  getNavTitle(url: string): void {
    this.urls.unshift(url); //Add url to beginning of array (since the url is being recursively broken down from full url to its parent)
    if (url.lastIndexOf('/') > 0) {
      this.getNavTitle(url.substr(0, url.lastIndexOf('/'))); //Find last '/' and add everything before it as a parent route
    }
    if (this.urls[1] == '/zone/picture') {
      $('#zone_menu_picture').parent('.has-sub').addClass('active');
      $('#zone_menu_picture').removeClass('hidden');
    }
  }

  onMenu(event: any) {
    $(event.target.nextElementSibling).toggleClass('hidden');
  }

}
