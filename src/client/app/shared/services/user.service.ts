import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Http, Response} from '@angular/http';
import {ApiBaseService} from './apibase.service';

@Injectable()
export class UserService extends ApiBaseService {

  private _loggedIn:boolean = false;
  public profile: Object;

  constructor(http: Http) {
    super(http);
    this._loggedIn = !!localStorage.getItem('jwt');
    this.profile = JSON.parse(localStorage.getItem('profile'));
  }

  public login(path: string, body: string, useJwt?: boolean = true): Observable<Response>{
    // public login(path: string, body: string, useJwt?: boolean = true) {
    return super.post(path, body)
      .map(res => res.json())
      .map((res) => {
        if(res){
          this.storeLoggedUserInfo(res)
        }
        return res;
      });
  }

  public logout(path: string): Observable<Response>{
    // public logout(path: string) {
    return super.delete(path)
      .map(res => res.json())
      .map((res) => {
        localStorage.removeItem('jwt');
        localStorage.removeItem('profile');
        this._loggedIn = false;
        this.profile = null;
        return res;
      });
  }

  /*
   * `sign up` new an account.
   */
  public signup(path: string, body: string): Observable<Response>{
    return super.post(path, body)
      .map(res => res.json())
      .map((res) => {
        if(res){
          this.storeLoggedUserInfo(res);
        }
        return res;
      });
  }

  /*
   * `check if` user logged or did not.
   */
  public isLoggedIn(){
    return this._loggedIn;
  }

  private storeLoggedUserInfo(response){
    localStorage.setItem('jwt', response.token);
    localStorage.setItem('profile', JSON.stringify(response.data));
    this.profile = JSON.parse(localStorage.getItem('profile'));
    this._loggedIn = true;
  }
}


export class User {
  constructor(
    public first_name: string,
    public last_name: string,
    public email: string,
    public password: string,
    public birthday_day: string,
    public birthday_month: string,
    public birthday_year: string,
    public sex: number
  ) {}
}
