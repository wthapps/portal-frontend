import {Http} from '@angular/http';

import {Injectable} from '@angular/core';
import {BaseService} from "../base.service";

@Injectable()
export class PhotoService extends BaseService {

  url:string = 'zone/photos/';

  constructor(http: Http) {
    super(http);
  }

}
