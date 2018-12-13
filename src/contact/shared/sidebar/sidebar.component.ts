import { Component, OnDestroy, OnInit, Renderer2, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { ZContactSharedSettingsComponent } from '@contacts/shared/modal/settings/settings.component';
import { ApiBaseService, CommonEventService, WthConfirmService } from '@shared/services';
import { Group } from '../../group/group.model';
import { GroupService } from '../../group/group.service';
import { ICloudOAuthComponent } from '../modal/import-contact/icloud/icloud-oauth.component';
import { ZContactShareImportContactComponent } from '../modal/import-contact/import-contact.component';
import { ZContactService } from '../services/contact.service';

declare var _: any;

@Component({
  selector: 'z-contact-shared-sidebar',
  templateUrl: 'sidebar.component.html',
  styleUrls: ['sidebar.component.scss']
})
export class ZContactSharedSidebarComponent implements OnInit, OnDestroy {
  @ViewChild('importContactSelect') importContactSelect: ZContactShareImportContactComponent;
  @ViewChild('iCloudOAuthModal') iCloudOAuthModal: ICloudOAuthComponent;
  @ViewChild('modalSettings') modalSettings: ZContactSharedSettingsComponent;

  @Input() sharedCardNum: number;
  @Output() createCard = new EventEmitter<any>();
  @Output() reloaded = new EventEmitter<any>();


  groups: Group[];
  hostname: String = '';
  currentGroup: string;
  private destroySubject: Subject<any> = new Subject<any>();

  constructor(private router: Router,
              private groupService: GroupService,
              public contactService: ZContactService,
              private wthConfirmService: WthConfirmService,
              private apiBaseService: ApiBaseService,
              private renderer: Renderer2,
              private commonEventService: CommonEventService) {
    this.groupService.groups$
      .pipe(takeUntil(this.destroySubject))
      .subscribe(
        (res: any) => this.groups = res
      );
  }

  ngOnInit() {
    this.hostname = window.location.origin;
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroySubject))
      .subscribe((event: any) => {
        this.currentGroup = this.extractLabel(event.url);
      });
    // this.notificationService.getLatestNotifications();
  }

  ngOnDestroy() {
    this.destroySubject.next('');
    this.destroySubject.unsubscribe();
  }

  doEvent(event: any) {
    this.onCloseSidebar();
    if (event) {
      this.commonEventService.broadcast({ channel: 'contactCommonEvent', action: event.action, payload: event.payload });
      this.commonEventService.broadcast({ channel: 'menuCommonEvent', action: event.action, payload: event.payload });
    }
  }

  onReload() {
    this.onCloseSidebar();
    this.reloaded.emit({sharedCardNum: true});
  }

  onCreateCard() {
    this.createCard.emit(true);
  }

  onShowSettings() {
    this.onCloseSidebar();
    this.modalSettings.open();
  }

  onCloseSidebar() {
    this.renderer.removeClass(document.body, 'left-sidebar-open');
  }

  deleteGroup(group: any) {
    const contacts_length = group.count || 0;
    this.wthConfirmService.confirm({
      message: `This group has ${contacts_length} contacts. Delete this group will remove it from all contacts.
      <br /> This action can't be undone.`,
      header: 'Delete group',
      accept: () => {
        this.apiBaseService
          .delete(`contact/groups/${group.id}`)
          .subscribe((res: any) => {
            _.remove(this.groups, (gr: any) => {
              return gr.id === res.data.id;
            });
          });
      }
    });

  }

  openImportContactModal(options?: any) {
    this.importContactSelect.modal.open(options);
  }

  onImportOptionSelected(event: any) {
    switch (event.provider) {
      case 'google':
      case 'apple':
      case 'microsoft':
      case 'linkedin':
      case 'import_from_file':
        this.commonEventService.broadcast({
          channel: 'contact:contact:actions',
          action: 'contact:contact:import_contact',
          payload: event
        });
        break;
      default:
        console.warn('Unhandled import option: ', event.provider);
        break;
    }
  }

  private extractLabel(url: string) {
    const regExp = /group=([\w ]*)/;
    const match = decodeURI(url).match(regExp);

    if (match && match[1]) {
      return match[1];
    } else {
      return null;
    }
  }
}
