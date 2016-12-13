import {Http} from '@angular/http';

import {Injectable} from '@angular/core';
import {ApiBaseServiceV2} from "../apibase.service.v2";
import { Router } from '@angular/router';

@Injectable()
export class PhotoService extends ApiBaseServiceV2 {

  url:string = 'zone/photos/';

  constructor(http: Http,private router: Router) {
    super(http, router);
  }

}
