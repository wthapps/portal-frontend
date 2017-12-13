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
  get(path: string, body: any = ''): Observable<any> {
    if (typeof body == 'object') {
      body = '?' + this.paramsToString(body);
    }
    this.buildOptions();
    return this.http.get(this.baseUrl + path + body, this.options)
      .catch(this.handleError);
  }

  /**
   * Performs a request with `post` http method.
   */
  post(path: string, body: any = ''): Observable<any> {
    if (typeof body == 'object') {
      body = JSON.stringify(body);
    }
    this.buildOptions();
    return this.http.post(this.baseUrl + path, body, this.options)
      .take(1)
      .catch(this.handleError);
  }

  /**
   * Performs a request with `put` http method.
   */
  put(path: string, body: any = ''): Observable<any> {
    if (typeof body == 'object') {
      body = JSON.stringify(body);
    }
    this.buildOptions();
    return this.http.put(this.baseUrl + path, body, this.options)
      .take(1)
      .catch(this.handleError);
  }

  /**
   * Performs a request with `delete` http method.
   */
  delete(path: string): Observable<any> {
    this.buildOptions();
    return this.http.delete(this.baseUrl + path, this.options)
      .take(1)
      .catch(this.handleError);
  }

  /**
   * Performs a request with `patch` http method.
   */
  patch(path: string, body: any = ''): Observable<any> {
    this.buildOptions();
    return this.http.patch(this.baseUrl + path, body, this.options)
      .take(1)
      .catch(this.handleError);
  }

  download(path: string, body: any = ''): Observable<any> {
    if (typeof body === 'object') {
      body = JSON.stringify(body);
    }
    this.buildOptions();
    // TODO fix
    // return null;
    return this.http.post(this.baseUrl + path, body, {
      responseType: 'blob',
      headers: this.headers
    }).take(1);
  }

  paramsToString(params: any): string {
    let str: string = '';
    for (let param in params) {
      str += param + '=' + params[param] + '&';
    }
    str = str.slice(0, -1);
    return str;
  }

  private buildOptions() {
    // Json web token
    // let jwt = localStorage.getCommunity('jwt');
    // let profile = JSON.parse(localStorage.getCommunity('profile'));

    let jwt = this.cookieService.get('jwt');

    //let profile = JSON.parse(Cookie.get('profile'));

    this.headers = this.headers.delete('Authorization');
    if (jwt) {
      this.headers = this.headers.set('Authorization', 'Bearer ' + jwt);
    }
    this.options = {
      headers: this.headers,
      responseType: 'json'
    };
  }

  // TODO refactor
  private handleError(error: any | any): any {
    return Observable.throw(error);

    // redirect to login page if there is not a user logged in
    // if (error.status === 401 && error.statusText == 'Unauthorized') {
    //   this.router.navigate(['/login']);
    //   // return;
    // }
    //
    // // In a real world app, we might use a remote logging infrastructure
    // let errMsg: string;
    // if (error instanceof Response) {
    //   console.log('errro', error);
    //   const body = error.json() || '';
    //   const err = body.error || JSON.stringify(body);
    //   errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    // } else {
    //   errMsg = error.message ? error.message : error.toString();
    // }
    // console.error('handle error', errMsg);

    // return Observable.throw(errMsg);

    // if (error.status === 401 && error.statusText == 'Unauthorized') {
    //   let _route = this.router;
    //   _route.navigate(['/login']);
    // }
  }
}
