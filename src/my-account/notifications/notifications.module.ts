import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CommonNotificationsComponent } from '@wth/shared/shared/components/notification-list/notifications.component';
import { WthCommonModule } from '@wth/shared/common/wth-common.module';
import { MySharedModule } from '@account/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    MySharedModule,

    RouterModule.forChild([
      { path: '', component: CommonNotificationsComponent }
    ])
  ],
  declarations: [],
  exports: [CommonModule, WthCommonModule],
  providers: []
})
export class MyNotificationModule {}
