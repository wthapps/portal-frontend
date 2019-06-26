import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { throwError, Observable } from 'rxjs';
import { take, catchError, switchMap } from 'rxjs/operators';


import { CookieService } from 'ngx-cookie';
import { Constants } from '../constant/config/constants';
import {
  HttpClient,
  HttpHeaders,
  HttpParams
} from '@angular/common/http';
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
  private baseUrl: string = Constants.baseUrls.apiUrl;
  private headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    ACCEPT: 'application/json'
  });

  static instance: ApiBaseService;

  constructor(
    public http: HttpClient,
    public router: Router,
    public cookieService: CookieService
  ) {
    ApiBaseService.instance = this;
  }

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
    return command.pipe(
      take(1),
      switchMap(c => this.call(c.method, c.path, c.body, c.options)),
      catchError(this.handleError)
    );
  }

  protected call(
    method: string,
    path: string,
    body: any = '',
    options: any = {}
  ): Observable<any> {
    this.buildOptions(options);
    if (method === 'get' || method === 'delete') {
      return this.http[method](
        this.baseUrl + path + UrlConverterUtil.objectToUrl(body),
        this.options
      ).pipe(
        take(1),
        catchError(this.handleError)
      );
    } else {
      return this.http[method](
        this.baseUrl + path,
        JsonConverterUtil.objectToString(body),
        this.options
      ).pipe(
        take(1),
        catchError(this.handleError)
      );
    }
  }

  private buildOptions(options: any = {}) {
    // Json web token
    if (!options.unauthen) {
      const jwt = this.cookieService.get(Constants.cookieKeys.jwt);
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
    return throwError(error);
  }
}
