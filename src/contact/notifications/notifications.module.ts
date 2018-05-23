import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CommonNotificationsComponent } from '@wth/shared/shared/components/notification-list/notifications.component';
import { WthCommonModule } from '@wth/shared/common/wth-common.module';

@NgModule({
  imports: [
    CommonModule,
    WthCommonModule,

    RouterModule.forChild([
      { path: '', component: CommonNotificationsComponent }
    ])
  ],
  declarations: [],
  exports: [],
  providers: []
})
export class ContactNotificationModule {}
