import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Group } from '@contacts/group/group.model';
import { GroupService } from '@contacts/group/group.service';
import { ZContactService } from '@contacts/shared/services/contact.service';
import { CommonEventService } from '@shared/services';
import { ApiBaseService } from '@shared/services/apibase.service';
import { WthConfirmService } from '@shared/shared/components/confirmation/wth-confirm.service';
import { Subject } from 'rxjs/Subject';

declare var _: any;

@Component({
  selector: 'z-contact-shared-left-menu',
  templateUrl: 'left-menu.component.html',
  styleUrls: ['left-menu.component.scss']
})
export class ZContactSharedLeftMenuComponent implements OnInit, OnDestroy {
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
    this.renderer.removeClass(document.body, 'left-sidebar-open');
    if (event) {
      this.commonEventService.broadcast({channel: 'contactCommonEvent', action: event.action, payload: event.payload});
      this.commonEventService.broadcast({channel: 'menuCommonEvent', action: event.action, payload: event.payload});
    }
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
