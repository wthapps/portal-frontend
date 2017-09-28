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
import { ApiBaseService } from '../../../services/apibase.service';
import { WthConfirmService } from '../../confirmation/wth-confirm.service';

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

  noteFolders: Array<any>;
  noteFoldersTree: any = [];

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
  currentLabel: string;

  // labels: Array<any>;
  commonEventSub: any;
  private destroySubject: Subject<any> = new Subject<any>();


  constructor(private userService: UserService,
              private route: ActivatedRoute,
              private router: Router,
              private navigateService: WTHNavigateService,
              private location: Location,
              private apiBaseService: ApiBaseService,
              private wthConfirmService: WthConfirmService,
              private commonEventService: CommonEventService
              // private labelService: LabelService
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
        this.currentLabel = this.extractLabel(event.url);
      });

    this.commonEventService.filter((event: any) => event.channel == 'noteFolderEvent' && event.action == 'updateFolders').subscribe((event: any) => {
      for (let folder of event.payload) {
        if (!event.payload.parent_id) {
          folder.label = folder.name;
          folder.icon = 'fa-folder-o';
          folder.items = [];
          folder.command = (event: any)=> this.loadMenu(event);
          this.noteFoldersTree.push(folder);
        }
      }
    });
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

  clearOutlets() {
    this.router.navigate([{outlets: {modal: null, detail: null}}]);
  }

  onMenu(event: string) {
    this.navigateService.navigateOrRedirect('/', event);
    console.log(event);
  }

  onSubMenu(link: string) {
    console.debug('onSubMenu:', link);
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

  deleteLabel(label: any) {
    this.wthConfirmService.confirm({
      message: 'Are you sure you want to delete this label ?',
      header: 'Delete label',
      accept: () => {
        this.apiBaseService.delete(`contact/labels/${label.id}`).subscribe((res: any) => {
          _.remove(this.contactMenu, (label: any) => {
            return label.id == res.data.id;
          });
        });
      }
    });

  }

  ngOnDestroy() {
    this.commonEventSub.unsubscribe();
    this.destroySubject.unsubscribe();
  }

  onNoteClick(event: any) {
    $(event.target).closest('ul').find('.well-folder-tree a').removeClass('active');
  }

  loadMenu(event: any) {
    event.originalEvent.stopPropagation();

    let htmlTarget: any = event.originalEvent.target;
    if ($(htmlTarget).hasClass('fa-caret-right') || $(htmlTarget).hasClass('fa-caret-down')) {
      console.log(event);
      if (event.item.expanded) {
        this.apiBaseService.get(`note/folders/${event.item.id}`).subscribe((res: any) => {
          event.item.items.length = 0;
          for (let folder of res.data) {
            folder.label = folder.name;
            folder.icon = 'fa-folder-o';
            folder.items = [];
            folder.command = (event: any)=> this.loadMenu(event);
            event.item.items.push(folder);
          }
        });
      }
    } else {
      this.router.navigate(['/my-note/folders', event.item.id]);
      event.item.expanded = !event.item.expanded;

      $(htmlTarget).closest('.well-folder-tree').find('a').removeClass('active');
      $(htmlTarget).closest('a').addClass('active');
    }
  }
}
