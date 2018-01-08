import { Component, Input } from '@angular/core';
import { NotificationService } from '@shared/services';


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

  constructor(private notificationService: NotificationService) {
  }

  undoHideNotification() {
    this.notificationService.undoNotification(this.notification);
  }
}
