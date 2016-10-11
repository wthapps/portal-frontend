import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';
import { ApiBaseService } from '../../shared/services/apibase.service';

@Injectable()
export class AppCardService extends ApiBaseService {

  constructor(http: Http) {
    super(http);
  }

  /**
   *
   * @param path Eg: '/products' (get all) or '/products/id'
   * @returns {Observable<Response>}
   */

  get(path: string): Observable<Response> {
    return super.get(path)
      .map(res => res.json())
      .map((res) => {
        if (res) {
          return res;
        }
        return [];
      });
  }

  update(path: string, body: string): Observable<Response> {
    return super.patch(path, body)
      .map(res => res.json())
      .map((res) => {
        if (res) {
          return res;
        }
        return [];
      });
  }
}
