import { Component, Input, OnDestroy, OnInit, OnChanges } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';


import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/do';

import { UserService } from '../../../services/user.service';
import { Constants } from '../../../config/constants';
import { WTHNavigateService } from '../../../services/wth-navigate.service';
import { CommonEventService } from '../../../services/common-event/common-event.service';
import { ZContactService } from '../../../../../contact/shared/services/contact.service';

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
  @Input() totalContactCount: number = 0;

  /**public event for somewhere are able to subscribe*/
  event: Observable<any>;


  uuid: string;
  urls: any;
  mediaMenu = Constants.pictureMenuItems;
  socialMenu = Constants.socialMenuItems;
  chatMenu = Constants.chatMenuItems;
  hostname: string = '';
  isProfileTab: boolean;
  currentLabel: string;

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
      .takeUntil(this.destroySubject)
      .subscribe((event: any) => {
        if (event.url.indexOf('profile') !== -1) {
          this.isProfileTab = true;
        } else {
          this.isProfileTab = false;
        }

        this.currentLabel = this.extractLabel(event.url);
      });
    // your logic to know if its my home page.

  }

  extractLabel(url: string) {
    let regExp = /label=([\w ]*)/;
    let match = decodeURI(url).match(regExp);

    if (match && match[1]) {
      return match[1];
    } else {
      return null;
    }
  }

  onMenu(event: string) {

    this.navigateService.navigateOrRedirect('', event);
    // $(event.target.nextElementSibling).toggleClass('hidden');
  }

  trackMenu(index: any, item: any) {
    return item.id;
  }

  doEvent(event: any) {
    // if (event.event) {
    //   event.event.preventDefault();
    // }
    this.commonEventService.broadcast({channel: 'contactCommonEvent', action: event.action, payload: event.payload});
  }

  ngOnDestroy() {
    this.commonEventSub.unsubscribe();
    this.destroySubject.unsubscribe();
  }
}
