import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TooltipModule } from 'primeng/components/tooltip/tooltip';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { PartialsNotificationsModule } from '../notifications/notifications.module';
import { HeaderNavbarComponent } from './navbar.component';
import { ServiceManager } from '../../../services/service-manager';
import { ApiBaseService } from '../../../services/apibase.service';
import { StorageService } from '../../../services/storage.service';
import { UserService } from '../../../services/user.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TooltipModule,
    InfiniteScrollModule,
    PartialsNotificationsModule
  ],
  declarations: [
    HeaderNavbarComponent
  ],
  exports: [
    HeaderNavbarComponent
  ],
  providers: [
  ]
})

export class HeaderNavbarModule {
}
