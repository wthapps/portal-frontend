import { ApiBaseService } from './apibase.service';
import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Constants } from '../config/constants';
import { Config } from '../config/env.config';

@Injectable()
export class ServiceManager {

  constructor(
    private apiBaseService: ApiBaseService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
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
}
