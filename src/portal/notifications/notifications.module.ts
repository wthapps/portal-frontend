import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonNotificationsComponent } from '@wth/shared/shared/components/notification-list/notifications.component';


@NgModule({
  imports: [
    RouterModule.forChild([
      {path: 'notifications', component: CommonNotificationsComponent},
    ])
  ]
})

export class NotificationModule {
}
