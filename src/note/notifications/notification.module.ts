import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuard } from '@wth/shared/services';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@wth/shared/shared.module';
import { NotificationsComponent } from './notifications.component';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: NotificationsComponent,
        canActivate: [AuthGuard]
      }
    ])
  ],
  declarations: [
    NotificationsComponent
  ],
  exports: [
    NotificationsComponent
  ],
  providers: []
})

/**
 * This module is intended to be lazy loaded. So not included in shared module
 */
export class NotificationModule {
}
