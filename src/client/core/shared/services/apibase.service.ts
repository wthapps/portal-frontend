import { Injectable } from '@angular/core';
import {
  Http, Headers, RequestOptions, RequestOptionsArgs, Response, RequestMethod,
  ResponseContentType
} from '@angular/http';
import { Router } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/take';
import 'rxjs/add/observable/throw';

import { CookieService } from 'ngx-cookie';
import { Constants } from '../config/constants';

@Injectable()
export class ApiBaseService {
  urls = Constants.urls;
  private _options: RequestOptionsArgs;
  private _baseUrl: string = Constants.baseUrls.apiBaseService;
  private _headers: Headers = new Headers({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'ACCEPT': 'application/json'
  });

  constructor(private http: Http,
              public router: Router,
              public cookieService: CookieService) {  }

  /**
   * Performs a request with `get` http method.
   */
  public get(path: string, body: any = ''): Observable<Response> {
    if (typeof body == 'object') {
      body = '?' + this.paramsToString(body);
    }
    this.buildOptions();
    return this.http.get(this._baseUrl + path + body, this._options)
      .map((res:any) => res.json())
      .catch(this.handleError);
  }

  /**
   * Performs a request with `post` http method.
   */
  public post(path: string, body: any = ''): Observable<Response> {
    if (typeof body == 'object') {
      body = JSON.stringify(body);
    }
    this.buildOptions();
    return this.http.post(this._baseUrl + path, body, this._options)
      .take(1)
      .map((res: any) => res.json())
      .catch(this.handleError);
  }

  /**
   * Performs a request with `put` http method.
   */
  public put(path: string, body: any = ''): Observable<Response> {
    if (typeof body == 'object') {
      body = JSON.stringify(body);
    }
    this.buildOptions();
    return this.http.put(this._baseUrl + path, body, this._options)
      .take(1)
      .map((res: any) => res.json())
      .catch(this.handleError);
  }

  /**
   * Performs a request with `delete` http method.
   */
  public delete(path: string): Observable<Response> {
    this.buildOptions();
    return this.http.delete(this._baseUrl + path, this._options)
      .take(1)
      .map((res: any) => res.json())
      .catch(this.handleError);
  }

  /**
   * Performs a request with `patch` http method.
   */
  public patch(path: string, body: any = ''): Observable<Response> {
    this.buildOptions();
    return this.http.patch(this._baseUrl + path, body, this._options)
      .take(1)
      .map((res: any) => res.json())
      .catch(this.handleError);
  }

  download(path: string, body: any=''): Observable<Response> {
    return this.http.post(this._baseUrl + path, body, {
      method: RequestMethod.Post,
      responseType: ResponseContentType.Blob,
      headers: this._headers
    });
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

    this._headers.delete('Authorization');
    if (jwt) {
      this._headers.append('Authorization', 'Bearer ' + jwt);
    }
    this._options = new RequestOptions({headers: this._headers});
  }

  // TODO refactor
  private handleError(error: Response | any): any {
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
