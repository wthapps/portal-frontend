import { ModuleWithProviders, NgModule, Optional, SkipSelf }       from '@angular/core';
import { CommonModule }      from '@angular/common';

import { UserService } from './shared/services/user.service';
import { ApiBaseService } from './shared/services/apibase.service';
import { NameListService } from './shared/name-list/name-list.service';
import { ConfirmationService } from 'primeng/components/common/api';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { StorageService } from './shared/services/storage.service';
import { HandlerService } from './shared/services/handler.service';
import { SoSearchService } from './partials/header/sub/social-search.service';
import { NotificationService } from './shared/channels/notification.service';
import { NotificationChannelService } from './shared/channels/channel-notification.service';
import { AppearancesChannelService } from './shared/channels/appearances-channel.service';
import { AuthGuard } from './shared/services/auth-guard.service';
import { CanDeactivateGuard } from './shared/services/can-deactivate-guard.service';
import { AuthService } from './shared/services/auth.service';

@NgModule({
  imports:      [ CommonModule ],
  providers:    [ UserService ]
})

export class CoreModule {
  constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only');
    }
  }

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: [
        ApiBaseService,
        UserService,
        AuthGuard,
        AuthService,
        CanDeactivateGuard,
        NameListService,
        ConfirmationService,
        CookieService,
        StorageService,
        HandlerService,
        SoSearchService,
        NotificationService,
        NotificationChannelService,
        AppearancesChannelService
      ]
    };
  }
}
