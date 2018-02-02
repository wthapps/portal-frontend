import { NgModule } from '@angular/core';
import { SharedModule } from '@wth/shared/shared.module';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CommonNotificationsComponent } from '@wth/shared/shared/components/notification-list/notifications.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,

    RouterModule.forChild([
      {path: '', component: CommonNotificationsComponent},
    ])
  ],
  declarations: [
  ],
  exports: [
  ],
  providers: []
})

export class ContactNotificationModule {
}
