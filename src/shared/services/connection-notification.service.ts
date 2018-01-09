import { Injectable, EventEmitter } from '@angular/core';


import { ApiBaseService } from './apibase.service';
import { Constants } from '../constant/config/constants';
import { UserService } from './user.service';
import { WTHNavigateService } from './wth-navigate.service';
import { CommonNotificationInterface } from '@wth/shared/services/common-notification.service';

@Injectable()
export class ConnectionNotificationService extends CommonNotificationInterface{
  readonly url: string = Constants.urls.zoneSoConnections;

  constructor(protected api: ApiBaseService,
              protected navigateService: WTHNavigateService,
              protected userService: UserService) {
    super(api, navigateService, userService);
  }

}




