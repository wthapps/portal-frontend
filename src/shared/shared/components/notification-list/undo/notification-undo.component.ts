import { Component, Input } from '@angular/core';
import { NotificationService } from '@shared/services';
import { ConnectionNotificationService } from '@wth/shared/services/connection-notification.service';


declare var $: any;
declare var _: any;

/**
 * This class represents the header component.
 */
@Component({
  selector: 'app-partials-notification-undo',
  templateUrl: 'notification-undo.component.html'
})
export class NotificationUndoComponent {
  @Input() notification: any;
  @Input() type: string = 'update';

  constructor(private notificationService: NotificationService,
              private connectionService: ConnectionNotificationService) {
  }

  undoHideNotification() {
    if(this.type == 'connection')
      this.connectionService.undoNotification(this.notification);
    else
      this.notificationService.undoNotification(this.notification);
  }
}
