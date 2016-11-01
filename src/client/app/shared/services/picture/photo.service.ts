import {Http} from '@angular/http';

import {Injectable} from '@angular/core';
import {ApiBaseServiceV2} from "../apibase.service.v2";

@Injectable()
export class PhotoService extends ApiBaseServiceV2 {

  url:string = 'zone/photos/';

  constructor(http: Http) {
    super(http);
  }

}
