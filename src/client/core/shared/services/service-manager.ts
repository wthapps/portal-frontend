import { ApiBaseService } from './apibase.service';
import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Constants } from '../config/constants';
import { Config } from '../config/env.config';
import { StorageService } from './storage.service';
import { ChatCommonService } from './chat.common.service';

@Injectable()
export class ServiceManager {

  constructor(
    private apiBaseService: ApiBaseService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private storageService: StorageService,
    private router: Router,
    private chatCommonService: ChatCommonService,
  ) {
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
}
