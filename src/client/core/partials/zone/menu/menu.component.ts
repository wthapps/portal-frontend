import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs/Observable';


import { UserService } from '../../../shared/services/user.service';
import { Constants } from '../../../shared/config/constants';
import { WTHNavigateService } from '../../../shared/services/wth-navigate.service';
import { CommonEventService } from '../../../shared/services/common-event/common-event.service';
import { LabelService } from '../../../../contact/label/label.service';
import { Label } from '../../../../contact/label/label.model';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-shared-menu',
  templateUrl: 'menu.component.html',
  styleUrls: ['menu.component.css']
})

export class ZSharedMenuComponent implements OnInit {
  /**public event for somewhere are able to subscribe*/
  event: Observable<any>;


  uuid: string;
  urls: any;
  mediaMenu = Constants.pictureMenuItems;
  socialMenu = Constants.socialMenuItems;
  chatMenu = Constants.chatMenuItems;
  contactMenu: Array<any> = new Array<any>(); //= Constants.contactMenuItems;
  hostname: string = '';
  isProfileTab: boolean;

  labels: Array<any>;
  commonEventSub: any;

  constructor(private userService: UserService,
              private route: ActivatedRoute,
              private router: Router,
              private navigateService: WTHNavigateService,
              private location: Location,
    private commonEventService: CommonEventService,
    private labelService: LabelService
  ) {
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

    this.contactMenu.push(Constants.contactMenuItems[0]);
    this.labelService.getAll().subscribe(
      (response: any) => {
        this.labels = response.data;

        //map labels to ContactMenu Item
        _.each(this.labels, (label: Label) => {
          this.contactMenu.push({
            name: label.name,
            link: '',
            icon: 'fa fa-ban'
          });
        });


        // TODO check leak memory here
        // this.commonEventSub = this.commonEventService.event.subscribe((event: any) => {
        //   this.doEvent(event);
        // });

      }
    );

  }

  onMenu(event: string) {

    this.navigateService.navigateOrRedirect('', event);
    // $(event.target.nextElementSibling).toggleClass('hidden');
  }

  trackByFn() {

  }

  doEvent(event: any) {
    if (event.event) {
      event.event.preventDefault();
    }
    switch (event.action) {
      case 'contact:label:delete_refresh_list':
        _.remove(this.labels, {name: event.payload.selectedItem.name});
        _.remove(this.contactMenu, {name: event.payload.selectedItem.name});
        // this.commonEventSub.unsubscribe();
        break;
      default:
        this.commonEventService.broadcast(event);
        break;
    }

  }

  getLabel(name: string): Label {
    return _.find(this.labels, {name: name});
  }

}
