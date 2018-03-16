import { Injectable } from '@angular/core';

import { ApiBaseService } from './apibase.service';
import { Constants } from '../constant/config/constants';
import { WTHNavigateService } from './wth-navigate.service';
import { CommonNotificationInterface } from '@wth/shared/services/common-notification.service';
import { AuthService } from '@wth/shared/services/auth.service';

@Injectable()
export class ConnectionNotificationService extends CommonNotificationInterface {
  readonly url: string = Constants.urls.zoneSoConnections;

  constructor(protected api: ApiBaseService,
              protected navigateService: WTHNavigateService,
              protected authService: AuthService) {
    super(api, navigateService, authService);
  }

}




