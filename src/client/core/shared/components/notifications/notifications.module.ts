import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { CheckboxModule } from 'primeng/components/checkbox/checkbox';
import { TooltipModule } from 'primeng/components/tooltip/tooltip';

import { PipeModule } from '../../pipe/pipe.module';

import { PartialsNotificationsComponent } from './notifications.component';
import { NotificationItemComponent } from './item/notification-item.component';
import { UndoNotificationComponent } from './undo-notification.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,

    Ng2Bs3ModalModule,
    CheckboxModule,
    TooltipModule,

    PipeModule,
  ],
  declarations: [
    PartialsNotificationsComponent,
    NotificationItemComponent,
    UndoNotificationComponent
  ],
  exports: [
    PartialsNotificationsComponent,
    NotificationItemComponent,
    UndoNotificationComponent
  ],
  providers: []
})

export class PartialsNotificationsModule {
}
