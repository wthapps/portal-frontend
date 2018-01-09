import { Injectable, EventEmitter } from '@angular/core';
import 'rxjs/add/operator/toPromise';

import { ApiBaseService } from './apibase.service';
import { Constants } from '../constant/config/constants';
import { NotificationChannelService } from '../channels/notification-channel.service';
import { UserService } from './user.service';
import { WTHNavigateService } from './wth-navigate.service';
import { CommonNotificationInterface } from '@wth/shared/services/common-notification.service';

/**
 * Created by phat on 18/11/2016.
 */

declare var _: any;

@Injectable()
export class NotificationService extends CommonNotificationInterface {
  url: string = Constants.urls.zoneSoNotifications;

  constructor(protected api: ApiBaseService,
              protected navigateService: WTHNavigateService,
              protected userService: UserService) {
    super(api, navigateService, userService);
  }
}
