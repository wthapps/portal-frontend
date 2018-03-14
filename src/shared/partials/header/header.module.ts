import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TooltipModule } from 'primeng/components/tooltip/tooltip';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { HeaderComponent } from './header.component';
import { NotificationListModule } from '@shared/shared/components/notification-list/notification-list.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TooltipModule,
    InfiniteScrollModule,
    NotificationListModule
  ],
  declarations: [
    HeaderComponent
  ],
  exports: [
    HeaderComponent
  ],
  providers: []
})

export class HeaderModule {
}
