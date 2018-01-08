import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TooltipModule } from 'primeng/components/tooltip/tooltip';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { PartialsNotificationsModule } from '../notifications/notifications.module';
import { HeaderNavbarComponent } from './navbar.component';
import { NotificationListModule } from '@shared/shared/components/notification-list/notification-list.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TooltipModule,
    InfiniteScrollModule,
    PartialsNotificationsModule,
    NotificationListModule
  ],
  declarations: [
    HeaderNavbarComponent
  ],
  exports: [
    HeaderNavbarComponent
  ],
  providers: []
})

export class HeaderNavbarModule {
}
