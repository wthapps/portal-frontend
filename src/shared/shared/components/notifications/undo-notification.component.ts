import {
  Component,
  Input
} from '@angular/core';
import { NotificationService } from '../../services/notification.service';


declare var $: any;
declare var _: any;

/**
 * This class represents the header component.
 */
@Component({
    selector: 'undo-notification',
  template: `<div class="p10" *ngIf="!!notification?.isHidden">This notification is now hidden. <a href="javascript:;" (click)="undoHideNotification()">Undo</a></div>`
})
export class UndoNotificationComponent {
  @Input() notification: any;

  constructor(private notificationService: NotificationService) {

  }

  undoHideNotification() {
    console.log('undoHideNotification', this.notification);
    this.notificationService.undoNotification(this.notification);
  }

}
