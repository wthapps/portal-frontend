import { ApiBaseService } from './apibase.service';
import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Constants } from '../../constant/config/constants';
import { Config } from '../../constant/config/env.config';
import { StorageService } from './storage.service';
import { ChatCommonService } from './chat.common.service';
import { NotificationService } from './notification.service';
import { CommonEventService } from './common-event/common-event.service';
import { UrlService } from './url.service';

@Injectable()
export class ServiceManager {

  constructor(public apiBaseService: ApiBaseService,
              public fb: FormBuilder,
              public route: ActivatedRoute,
              public storageService: StorageService,
              public router: Router,
              public urlService: UrlService,
              public chatCommonService: ChatCommonService,
              public commonEventService: CommonEventService,
              public notificationService: NotificationService) {
  }

  getApi() {
    return this.apiBaseService;
  }

  getFormBuilder() {
    return this.fb;
  }

  getActiveRoute() {
    return this.route;
  }

  getConstants() {
    return Constants;
  }

  getRouter() {
    return this.router;
  }

  getConfig() {
    return Config;
  }

  getStorageService() {
    return this.storageService;
  }

  getChatCommonService() {
    return this.chatCommonService;
  }

  getCommonNotificationService() {
    return this.notificationService;
  }

  getCommonEventService() {
    return this.commonEventService;
  }
}
