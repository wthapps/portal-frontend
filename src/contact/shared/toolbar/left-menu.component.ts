import { Component, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Group } from '@contacts/group/group.model';
import { GroupService } from '@contacts/group/group.service';
import { ZContactService } from '@contacts/shared/services/contact.service';
import { CommonEventService } from '@shared/services';
import { ApiBaseService } from '@shared/services/apibase.service';
import { WthConfirmService } from '@shared/shared/components/confirmation/wth-confirm.service';
import { Subject } from 'rxjs/Subject';
import { ICloudOAuthComponent } from '@contacts/shared/modal/import-contact/icloud/icloud-oauth.component';
import { ZContactShareImportContactComponent } from '@contacts/shared/modal/import-contact/import-contact.component';

declare var _: any;

@Component({
  selector: 'z-contact-shared-left-menu',
  templateUrl: 'left-menu.component.html',
  styleUrls: ['left-menu.component.scss']
})
export class ZContactSharedLeftMenuComponent implements OnInit, OnDestroy {
  @ViewChild('importContactSelect') importContactSelect: ZContactShareImportContactComponent;
  @ViewChild('iCloudOAuthModal') iCloudOAuthModal: ICloudOAuthComponent;

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
      .takeUntil(this.destroySubject)
      .subscribe(
        (res: any) => this.groups = res
      );
  }

  ngOnInit() {
    this.hostname = window.location.origin;
    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .takeUntil(this.destroySubject)
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

  onCloseSidebar() {
    this.renderer.removeClass(document.body, 'left-sidebar-open');
  }

  deleteGroup(group: any) {
    this.wthConfirmService.confirm({
      message: 'Are you sure you want to delete this group ?',
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
    let regExp = /group=([\w ]*)/;
    let match = decodeURI(url).match(regExp);

    if (match && match[1]) {
      return match[1];
    } else {
      return null;
    }
  }
}
