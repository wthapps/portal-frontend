import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import 'rxjs/add/observable/throw';

import { CookieService } from 'ngx-cookie';
import { Constants } from '../constant/config/constants';
import {
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpResponse
} from '@angular/common/http';
import { RequestMethod, ResponseContentType } from '@angular/http';
import { JsonConverterUtil } from '@shared/shared/utils/converters/json-converter.util';
import { UrlConverterUtil } from '@shared/shared/utils/converters/url-converter.util';

@Injectable()
export class ApiBaseService {
  urls = Constants.urls;
  private options: {
    headers?: HttpHeaders | { [header: string]: string | string[] };
    observe?: 'body';
    params?: HttpParams | { [param: string]: string | string[] };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
  };
  private baseUrl: string = Constants.baseUrls.apiBaseService;
  private headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    ACCEPT: 'application/json'
  });

  constructor(
    public http: HttpClient,
    public router: Router,
    public cookieService: CookieService
  ) {}

  /**
   * Performs a request with `get` http method.
   */
  get(path: string, body: any = '', options: any = {}): Observable<any> {
    return this.call('get', path, body, options);
  }

  /**
   * Performs a request with `post` http method.
   */
  post(path: string, body: any = '', options: any = {}): Observable<any> {
    return this.call('post', path, body, options);
  }

  /**
   * Performs a request with `put` http method.
   */
  put(path: string, body: any = '', options: any = {}): Observable<any> {
    return this.call('put', path, body, options);
  }

  /**
   * Performs a request with `delete` http method.
   */
  delete(path: string, body: any = '', options: any = {}): Observable<any> {
    return this.call('delete', path, body, options);
  }

  /**
   * Performs a request with `patch` http method.
   */
  patch(path: string, body: any = '', options: any = {}): Observable<any> {
    return this.call('patch', path, body, options);
  }

  download(path: string, body: any = '', options: any = {}): Observable<any> {
    return this.call('post', path, body, (options = { responseType: 'blob' }));
  }

  addCommand(command: Observable<any>): Observable<any> {
    return Observable.create((observer: any) => {
      command.take(1).subscribe((c: any) => {
        this.call(c.method, c.path, c.body, c.options)
          .take(1)
          .catch(this.handleError)
          .subscribe((res: any) => {
            observer.next(res);
          });
      });
    });
  }

  protected call(
    method: string,
    path: string,
    body: any = '',
    options: any = {}
  ): Observable<any> {
    this.buildOptions(options);
    if (method == 'get' || method == 'delete') {
      return this.http[method](
        this.baseUrl + path + UrlConverterUtil.objectToUrl(body),
        this.options
      )
        .take(1)
        .catch(this.handleError);
    } else {
      return this.http[method](
        this.baseUrl + path,
        JsonConverterUtil.objectToString(body),
        this.options
      )
        .take(1)
        .catch(this.handleError);
    }
  }

  private buildOptions(options: any = {}) {
    // Json web token
    if (!options.unauthen) {
      let jwt = this.cookieService.get('jwt');
      this.headers = this.headers.delete('Authorization');
      if (jwt) {
        this.headers = this.headers.set('Authorization', 'Bearer ' + jwt);
      }
    }
    this.options = {
      headers: this.headers
    };
    if (options.responseType) {
      this.options.responseType = options.responseType;
    } else {
      this.options.responseType = 'json';
    }
  }

  protected handleError(error: any | any): any {
    if (error.status == 401 && error.statusText == 'Unauthorized') {
      window.location.href = `${Constants.baseUrls.app}/login?returnUrl=${
        window.location['href']
      }`;
    }

    return Observable.throw(error);
  }
}
