import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { BsModalModule } from 'ng2-bs3-modal';
import { CheckboxModule } from 'primeng/components/checkbox/checkbox';
import { TooltipModule } from 'primeng/components/tooltip/tooltip';
import { InputSwitchModule } from 'primeng/components/inputswitch/inputswitch';


import { PipeModule } from '../../pipe/pipe.module';

import { NotificationItemComponent } from '@shared/shared/components/notification-list/item/notification-item.component';
import { NotificationListComponent } from '@shared/shared/components/notification-list/notification-list.component';
import { NotificationUndoComponent } from '@shared/shared/components/notification-list/undo/notification-undo.component';
import { NotificationSettingModalComponent } from '@shared/shared/components/notification-list/modal/modal.component';
import { CommonNotificationsComponent } from '@wth/shared/shared/components/notification-list/notifications.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { BoxLoadingModule } from '@wth/shared/shared/components/box-loading/box-loading.module';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,

    BsModalModule,
    CheckboxModule,
    TooltipModule,
    InputSwitchModule,
    InfiniteScrollModule,
    BoxLoadingModule,

    PipeModule,
  ],
  declarations: [
    NotificationListComponent,
    NotificationItemComponent,
    NotificationUndoComponent,
    NotificationSettingModalComponent,
    CommonNotificationsComponent,
  ],
  exports: [
    NotificationListComponent,
    NotificationItemComponent,
    NotificationUndoComponent,
    NotificationSettingModalComponent,
    CommonNotificationsComponent,
  ],
  providers: []
})

export class NotificationListModule {
}
