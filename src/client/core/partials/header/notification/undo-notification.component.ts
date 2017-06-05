import {
  Component, Input
} from '@angular/core';
import { NotificationService } from '../../../shared/services/notification.service';

declare var $: any;
declare var _: any;

/**
 * This class represents the header component.
 */
@Component({
  moduleId: module.id,
  selector: 'undo-notification',
  template: `<div *ngIf="notification.isHidden"> Unhide this notification <button (click)="undoHideNotification()">Undo</button></div>`
})
export class UndoNotificationComponent  {
  @Input() notification: any;

  constructor(private notificationService: NotificationService) {

  }

  undoHideNotification() {
    console.log('undoHideNotification', this.notification);
    this.notificationService.undoNotification(this.notification)
      .subscribe(
        () =>  this.notification.isHidden = false
      );
  }

}
