import { Component, Input, OnDestroy, OnInit, OnChanges, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, NavigationEnd, Params } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

import { UserService } from '../../../../services/user.service';
import { Constants } from '../../../../constant/config/constants';
import { WTHNavigateService } from '../../../../services/wth-navigate.service';
import { CommonEventService } from '../../../../services/common-event/common-event.service';
import { ApiBaseService } from '../../../../services/apibase.service';
import { WthConfirmService } from '../../confirmation/wth-confirm.service';


@Component({
  selector: 'z-shared-menu',
  templateUrl: 'menu.component.html',
  styleUrls: ['menu.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ZSharedMenuComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() contactMenu: Array<any>;
  @Input() totalContactCount: number = 0;

  /**public event for somewhere are able to subscribe*/
  event: Observable<any>;

  uuid: string;
  urls: any;
  mediaMenu = Constants.pictureMenuItems;
  socialMenu = Constants.socialMenuItems;
  chatMenu = Constants.chatMenuItems;
  noteMenu = Constants.noteMenuItems;
  hostname: string = '';
  isProfileTab: boolean;
  currentGroup: string;
  commonEventSub: any;
  private destroySubject: Subject<any> = new Subject<any>();

  private currentFolderTree: any;

  constructor(private userService: UserService,
              private route: ActivatedRoute,
              private router: Router,
              private navigateService: WTHNavigateService,
              private location: Location,
              private apiBaseService: ApiBaseService,
              private wthConfirmService: WthConfirmService,
              private commonEventService: CommonEventService
  ) {
    this.uuid = this.userService.getProfileUuid();
    this.urls = Constants.baseUrls;
  }

  ngOnInit() {
    this.hostname = window.location.origin;
    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .takeUntil(this.destroySubject)
      .subscribe((event: any) => {
        if (event.url.indexOf('my-profile') !== -1) {
          this.isProfileTab = true;
        } else {
          this.isProfileTab = false;
        }
        this.currentGroup = this.extractLabel(event.url);
      });

  }

  ngAfterViewInit() {
  }

  extractLabel(url: string) {
    let regExp = /group=([\w ]*)/;
    let match = decodeURI(url).match(regExp);

    if (match && match[1]) {
      return match[1];
    } else {
      return null;
    }
  }

  clearOutlets(): Promise<any> {
    console.debug('ClearOutlets ......');
    return this.router.navigate([{outlets: {modal: null, detail: null}}]);
  }

  onMenu(event: string) {
    this.navigateService.navigateOrRedirect('/', event);
    console.log(event);
  }

  onSubMenu(link: string) {
    if(this.urls.social == this.hostname)
      this.clearOutlets().then(() => this.navigateService.navigateOrRedirect(link));
    else
      this.navigateService.navigateOrRedirect(link);
  }

  trackMenu(index: any, item: any) {
    return item.id;
  }

  doEvent(event: any) {
    // if (event.event) {
    //   event.event.preventDefault();
    // }
    this.commonEventService.broadcast({channel: 'contactCommonEvent', action: event.action, payload: event.payload});
    this.commonEventService.broadcast({channel: 'menuCommonEvent', action: event.action, payload: event.payload});
  }

  deleteGroup(group: any) {
    this.wthConfirmService.confirm({
      message: 'Are you sure you want to delete this group ?',
      header: 'Delete group',
      accept: () => {
        this.apiBaseService.delete(`contact/groups/${group.id}`).subscribe((res: any) => {
          _.remove(this.contactMenu, (group: any) => {
            return group.id == res.data.id;
          });
        });
      }
    });

  }

  ngOnDestroy() {
    this.commonEventSub.unsubscribe();
    this.destroySubject.unsubscribe();
  }
}
