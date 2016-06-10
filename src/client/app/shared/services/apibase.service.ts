import {Injectable} from '@angular/core';
import {Http, Headers, RequestOptions, RequestOptionsArgs, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export abstract class ApiBaseService {
  private _http:Http;
  private _options:RequestOptionsArgs;
  //private _baseUrl:string = 'http://52.221.221.245:4000/';
  private _baseUrl:string = 'http://localhost:4000/';
  private _headers:Headers = new Headers({'Content-Type': 'application/json'});

  constructor(http:Http) {
    this._http = http;
  }

  /**
   * Performs a request with `get` http method.
   */
  public get(path:string):Observable<Response> {
    this.buildOptions();
    return this._http.get(this._baseUrl + path, this._options);
  }

  /**
   * Performs a request with `post` http method.
   */
  public post(path:string, body:string, useJwt?:boolean = true):Observable<Response> {
    this.buildOptions();
    return this._http.post(this._baseUrl + path, body, this._options);
  }

  /**
   * Performs a request with `put` http method.
   */
  public put(path:string, body:string):Observable<Response> {
    this.buildOptions();
    return this._http.put(this._baseUrl + path, body, this._options);
  }

  /**
   * Performs a request with `delete` http method.
   */
  public delete(path:string):Observable<Response> {
    this.buildOptions();
    return this._http.delete(this._baseUrl + path, this._options);
  }

  /**
   * Performs a request with `patch` http method.
   */
  public patch(path:string, body:string):Observable<Response> {
    this.buildOptions();
    return this._http.patch(this._baseUrl + path, body, this._options);
  }

  private buildOptions() {
    // Json web token
    let jwt = localStorage.getItem('jwt');
    let profile = JSON.parse(localStorage.getItem('profile'));
    this._headers.delete('Authorization');
    this._headers.delete('X-sid');
    if (jwt) {
      this._headers.append('Authorization', 'Bearer ' + jwt);
      this._headers.append('X-sid', profile === null ? '' : profile.session.uuid);
    }
    this._options = new RequestOptions({headers: this._headers});
  }
}
