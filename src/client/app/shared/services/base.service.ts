import { Http } from '@angular/http';

import { Injectable } from '@angular/core';

import { ApiBaseService } from './apibase.service';

@Injectable()
export class BaseService extends ApiBaseService {

  constructor(http: Http) {
    super(http);
  }

  get(url: string, params: any = '') {
    if (typeof params == 'object') {
      params = this.paramsToString(params);
    }
    return super.get(url + params);
  }

  post(url: string, params: any = '') {
    if (typeof params == 'object') {
      params = JSON.stringify(params);
    }
    return super.post(url, params).map(res => res.json());
  }

  put(url: string, params: any = '') {
    if (typeof params == 'object') {
      params = JSON.stringify(params);
    }
    return super.put(url, params).map(res => res.json());
  }

  delete(url: string) {
    return super.delete(url).map(res => res.json());
  }

  paramsToString(params: any): string {
    let str: string = '';
    for (let param in params) {
      str += param + '=' + params[param] + '&';
    }
    str = str.slice(0, -1);
    return str;
  }
}
