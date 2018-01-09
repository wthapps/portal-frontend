import { Component, OnInit, ViewChild, ViewEncapsulation, Input, AfterViewInit } from '@angular/core';
import { NotificationService } from '@wth/shared/services';
import { Constants } from '@wth/shared/constant';
import { NotificationListComponent } from '@shared/shared/components/notification-list/notification-list.component';
import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { ConnectionNotificationService } from '@wth/shared/services/connection-notification.service';


@Component({
  selector: 'common-notifications',
  templateUrl: 'notifications.component.html',
  styleUrls: ['notifications.component.scss'],
})

export class CommonNotificationsComponent implements OnInit, AfterViewInit{
  readonly communitiesUrl: string = '/' + Constants.urls.communities;
  readonly profileUrl: string = '/' + Constants.urls.profile;

  @Input() type: string = 'update'; // update, connection

  @ViewChild('notifications') notificationListComponent: NotificationListComponent;
  @ViewChild('settings') settingsModal: ModalComponent;

  constructor(public notificationService: NotificationService,
              public connectionService: ConnectionNotificationService) {
  }

  ngOnInit() {
    this.notificationService.getLatestNotifications();
  }

  ngAfterViewInit() {
    const _this = this;

    $('body').on('click', (e: any) => {
      console.debug($('#notiItemMenuEl'));
      console.debug('click .js-confirmHideNotification');
      _this.hideNotificationById(e.currentTarget.id);
    });

    $('body').on('click', '#notiItemMenuEl .js-toggleNotification', (e: any) => {
      _this.toggleNotificationById(e.currentTarget.id);
    });
  }

  hideNotificationById(id: any) {
    if(this.type === 'connection')
      this.connectionService.hideNotificationById(id);
    else
      this.notificationService.hideNotificationById(id);
  }

  toggleNotificationById(id) {
    console.log(id);
  }

  onSelectedTab(type: string) {
    this.type = type;
    if(this.type == 'connection')
      this.connectionService.getLatestNotifications();
    else
      this.notificationService.getLatestNotifications();
    console.log(this.notificationListComponent);
  }

  getMoreNotifications() {
    if(this.type == 'connection')
      this.connectionService.getMoreNotifications();
    else
      this.notificationService.getMoreNotifications();
  }

  isLoadingDone() {
    if(this.type == 'connection')
      return this.connectionService.isLoadingDone();
    else
      return this.notificationService.isLoadingDone();
  }


  onSettingModal() {
    this.notificationListComponent.settingModal.open();
  }
}
