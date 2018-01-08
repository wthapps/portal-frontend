import { Component, OnInit, Input, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { NotificationService } from '@shared/services';

@Component({
  selector: 'app-partials-notification-list',
  templateUrl: 'notification-list.component.html',
  styleUrls: ['notification-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class NotificationListComponent implements OnInit, AfterViewInit {
  @Input() type: string = 'update'; // update, connection
  @Input() size: string = 'sm'; // xs, sm, md, lg

  constructor(public notificationService: NotificationService) {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    const _this = this;

    $('body').on('click', '.js-confirmHideNotification', (e: any) => {
      _this.hideNotificationById(e.currentTarget.id);
    });

    $('body').on('click', '.js-toggleNotification', (e: any) => {
      _this.toggleNotificationById(e.currentTarget.id);
    });
  }

  hideNotificationById(id: any) {
    this.notificationService.hideNotificationById(id);
  }

  toggleNotificationById(id) {
    console.log(id);
  }
}
