import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TooltipModule } from 'primeng/components/tooltip/tooltip';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { HeaderComponent } from './header.component';
import { NotificationListModule } from '@shared/shared/components/notification-list/notification-list.module';
import { ComponentsModule } from '@shared/components/components.module';
import { InviteContactComponent } from '@shared/partials/invite-contact/invite-contact.component';
import { BsModalModule } from 'ng2-bs3-modal';
import { InviteContactModule } from '@shared/partials/invite-contact/invite-contact.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TooltipModule,
    InfiniteScrollModule,
    ComponentsModule,
    BsModalModule,
    InviteContactModule,
    NotificationListModule
  ],
  declarations: [HeaderComponent],
  exports: [HeaderComponent],
  providers: []
})
export class HeaderModule {}
