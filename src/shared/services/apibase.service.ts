import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import 'rxjs/add/observable/throw';

import { CookieService } from 'ngx-cookie';
import { Constants } from '../constant/config/constants';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { RequestMethod, ResponseContentType } from '@angular/http';


@Injectable()
export class ApiBaseService {
  urls = Constants.urls;
  private options: {
    headers?: HttpHeaders | {[header: string]: string | string[];};
    observe?: 'body';
    params?: HttpParams | { [param: string]: string | string[];};
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
  };
  private baseUrl: string = Constants.baseUrls.apiBaseService;
  private headers: HttpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'ACCEPT': 'application/json'
  });

  constructor(private http: HttpClient,
              public router: Router,
              public cookieService: CookieService) {  }

  /**
   * Performs a request with `get` http method.
   */
  get(path: string, body: any = '', options:any = {}): Observable<any> {
    this.buildOptions(options);
    return this.http.get(this.baseUrl + path + this.paramsToString(body), this.options)
      .catch(this.handleError);
  }

  /**
   * Performs a request with `post` http method.
   */
  post(path: string, body: any = '', options:any = {}): Observable<any> {
    this.buildOptions(options);
    return this.http.post(this.baseUrl + path, this.stringify(body), this.options)
      .take(1)
      .catch(this.handleError);
  }

  /**
   * Performs a request with `put` http method.
   */
  put(path: string, body: any = '', options:any = {}): Observable<any> {
    this.buildOptions(options);
    return this.http.put(this.baseUrl + path, this.stringify(body), this.options)
      .take(1)
      .catch(this.handleError);
  }

  /**
   * Performs a request with `delete` http method.
   */
  delete(path: string, body: any = '', options:any = {}): Observable<any> {
    this.buildOptions(options);
    return this.http.delete(this.baseUrl + path + this.paramsToString(body), this.options)
      .catch(this.handleError);
  }

  /**
   * Performs a request with `patch` http method.
   */
  patch(path: string, body: any = '', options:any = {}): Observable<any> {
    this.buildOptions(options);
    return this.http.patch(this.baseUrl + path, this.stringify(body), this.options)
      .take(1)
      .catch(this.handleError);
  }

  download(path: string, body: any = '', options:any = {}): Observable<any> {
    this.buildOptions(options);
    return this.http.post(this.baseUrl + path, this.stringify(body), {
      responseType: 'blob',
      headers: this.headers
    }).take(1);
  }

  stringify(body: any) {
    if (typeof body == 'object') {
      body = JSON.stringify(body);
    }
    return body;
  }

  paramsToString(body: any): string {
    if (typeof body == 'object') {
      let str: string = '';
      for (let param in body) {
        str += param + '=' + body[param] + '&';
      }
      str = str.slice(0, -1);
      return '?' + str;
    } else {
      return body;
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
      headers: this.headers,
    };
    if(!options.unjson) this.options.responseType = 'json';
  }

  private handleError(error: any | any): any {
    if (error.status == 401 && error.statusText == 'Unauthorized') {
      // window.location.href = `${Constants.baseUrls.app}/login?returnUrl=${window.location['href']}`;
    }

    return Observable.throw(error);
  }
}
