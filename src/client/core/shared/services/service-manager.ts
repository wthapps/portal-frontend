import { ApiBaseService } from './apibase.service';
import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Constants } from '../config/constants';

@Injectable()
export class ServiceManager {
  constants:any;

  constructor(
    private apiBaseService: ApiBaseService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.constants = Constants;
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
    return this.constants;
  }

  getRouter() {
    return this.router;
  }
}
