import {Http} from '@angular/http';

import {Injectable} from '@angular/core';
import {ApiBaseService} from "./apibase.service";


@Injectable()
export class BaseService extends ApiBaseService {

  constructor(http: Http) {
    super(http);
  }

  paramsToString(params:any):string {
    let str:string = '';
    for (let param in params) {
      str += param + "=" + params[param] + '&';
    }
    str = str.slice(0, -1);
    return str;
  }
}
