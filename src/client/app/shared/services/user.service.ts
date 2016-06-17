import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Http, Response} from '@angular/http';
import {Cookie}         from 'ng2-cookies/ng2-cookies'
import {ApiBaseService} from './apibase.service';

@Injectable()
export class UserService extends ApiBaseService {

  public loggedIn:boolean = false;
  public profile:Object = null;


  constructor(http:Http) {
    super(http);
    this.readUserInfo();
    console.log("loading ueser service");
  }

  public login(path:string, body:string, useJwt?:boolean = true):Observable<Response> {
    // public login(path: string, body: string, useJwt?: boolean = true) {
    return super.post(path, body)
      .map(res => res.json())
      .map((res) => {
        if (res) {
          this.storeUserInfo(res)
        }
        return res;
      });
  }

  public logout(path:string):Observable<Response> {
    // public logout(path: string) {
    return super.delete(path)
      .map(res => res.json())
      .map((res) => {
        this.deleteUserInfo();
        return res;
      });
  }

  /*
   * `sign up` new an account.
   */
  public signup(path:string, body:string):Observable<Response> {
    return super.post(path, body)
      .map(res => res.json())
      .map((res) => {
        if (res) {
          this.storeUserInfo(res);
        }
        return res;
      });
  }

  // /*
  //  * `check if` user logged or did not.
  //  */
  // public loggedIn(){
  //   // console.log('loading login: ', this._loggedIn);
  //   return this.loggedIn;
  // }

  /*
   * change current password
   */
  public changePassword(path:string, body:string):Observable<Response> {
    return super.patch(path, body)
      .map(res => res.json())
      .map((res) => {
        if (res) {

        }
        return res;
      });
  }

  private storeUserInfo(response) {
    console.log("store userinfo");
    Cookie.set('jwt', response.token);
    Cookie.set('profile', JSON.stringify(response.data));
    Cookie.set('logged_in', 'true');
    this.loggedIn = true;
    this.profile = response.data;
  }

  private readUserInfo() {
    console.log("read userinfo");
    this.profile = JSON.parse(Cookie.get('profile'));
    this.loggedIn = Boolean(Cookie.get('logged_in'));
  }

  private deleteUserInfo() {
    console.log("delete userinfo");
    Cookie.delete('jwt');
    Cookie.delete('logged_in');
    Cookie.delete('profile');
    this.loggedIn = false;
    this.profile = null;
  }

}

// export function loggedIn(){
//   // return !!localStorage.getItem('jwt');
//   // return !!Cookie.get('jwt');
//   console.log('loading111 login: ', this._loggedIn);
//   return this._loggedIn;
// }

export class User {
  constructor(public first_name:string,
              public last_name:string,
              public email:string,
              public password:string,
              public birthday_day:string,
              public birthday_month:string,
              public birthday_year:string,
              public sex:number,
              public accepted:boolean) {
  }
}
