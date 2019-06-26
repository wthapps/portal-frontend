import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { WthCommonModule } from '@wth/shared/common/wth-common.module';
import { MySharedModule } from '@account/shared/shared.module';
import { MyNotificationsComponent } from './notifications.component';
import { NotificationListModule } from '@shared/shared/components/notification-list/notification-list.module';

@NgModule({
  imports: [
    CommonModule,
    MySharedModule,
    NotificationListModule,

    RouterModule.forChild([{ path: '', component: MyNotificationsComponent }])
  ],
  declarations: [MyNotificationsComponent],
  exports: [CommonModule, WthCommonModule, MyNotificationsComponent],
  providers: []
})
export class MyNotificationModule {}
