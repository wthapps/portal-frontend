import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';
import { ApiBaseService } from '../../shared/services/apibase.service';
import { Router }         from '@angular/router';


@Injectable()
export class AppService extends ApiBaseService {

  constructor(http: Http: router: Router) {
    super(http, router);
  }

  /**
   *
   * @param path Eg: '/apps' (get all) or '/apps/id'
   * @returns {Observable<Response>}
   */

  get(path: string): Observable<Response> {
    return super.get(path)
      .map((res) => {
        if (res) {
          return res;
        }
        return [];
      });
  }

  update(path: string, body: string): Observable<Response> {
    return super.patch(path, body)
      .map((res) => {
        if (res) {
          return res;
        }
        return [];
      });
  }

  /*
   * User adds app to My Apps
   */
  add(path: string, body: string): Observable<Response> {
    return super.post(path, body)
      .map((res) => {
        if (res) {
          return res;
        }
        return [];
      });
  }
}
