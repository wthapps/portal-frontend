import { Injectable, EventEmitter } from '@angular/core';


import { ApiBaseService } from './apibase.service';
import { Constants } from '../constant/config/constants';
import { NotificationChannelService } from '../channels/notification-channel.service';
import { UserService } from './user.service';
import { WTHNavigateService } from './wth-navigate.service';
import { CommonNotificationInterface } from '@wth/shared/services/common-notification.service';
import { Observable } from 'rxjs';

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

  getNewNotificationCounts(): Observable<any> {
    return this.api.get(`${this.url}/get_new_notifications/count`);
  }
}
