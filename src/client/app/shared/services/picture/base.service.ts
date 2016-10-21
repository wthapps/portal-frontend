import {Http} from '@angular/http';
import {ApiBaseService} from '../apibase.service';

import {Injectable} from '@angular/core';

@Injectable()
export class ApiBaseServiceV2 extends ApiBaseService {

  constructor(http: Http) {
    super(http);
  }

  postV2 (url:string, params:any, callback:any) {
    if(params) {
      let body = JSON.stringify(params);
      this.post(url, body)
        .map(res => res.json())
        .subscribe(res => {
          callback(res);
        }),
        (error:any) => {
          console.log(error);
          callback([]);
        }
    } else {
      console.log('Missing Data: ', params);
      callback([]);
    }
  }
}
