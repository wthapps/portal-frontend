import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs/Observable';


import { UserService } from '../../../shared/services/user.service';
import { Constants } from '../../../shared/config/constants';
import { WTHNavigateService } from '../../../shared/services/wth-navigate.service';
import { CommonEventService } from '../../../shared/services/common-event/common-event.service';
import { LabelService } from '../../../../contact/label/label.service';
import { Label } from '../../../../contact/label/label.model';
import { Subject } from 'rxjs/Subject';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-shared-menu',
  templateUrl: 'menu.component.html',
  styleUrls: ['menu.component.css']
})

export class ZSharedMenuComponent implements OnInit, OnDestroy {

  @Input() contactMenu: Array<any>;

  /**public event for somewhere are able to subscribe*/
  event: Observable<any>;



  uuid: string;
  urls: any;
  mediaMenu = Constants.pictureMenuItems;
  socialMenu = Constants.socialMenuItems;
  chatMenu = Constants.chatMenuItems;
  hostname: string = '';
  isProfileTab: boolean;

  // labels: Array<any>;
  commonEventSub: any;
  private destroySubject: Subject<any> = new Subject<any>();


  constructor(private userService: UserService,
              private route: ActivatedRoute,
              private router: Router,
              private navigateService: WTHNavigateService,
              private location: Location,
    private commonEventService: CommonEventService
    // private labelService: LabelService
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
  }

  onMenu(event: string) {

    this.navigateService.navigateOrRedirect('', event);
    // $(event.target.nextElementSibling).toggleClass('hidden');
  }

  trackByFn() {

  }

  doEvent(event: any) {
    console.log('doEvent in menu:', event);
    if (event.event) {
      event.event.preventDefault();
    }
    this.commonEventService.broadcast(event);
  }

  ngOnDestroy() {
    this.commonEventSub.unsubscribe();
    this.destroySubject.unsubscribe();
  }
}
