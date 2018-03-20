import { Injectable } from '@angular/core';

import { UserService } from './user.service';
import { CookieService } from 'ngx-cookie';
import { ApiBaseService } from './apibase.service';
import { Observable } from 'rxjs/Observable';
import { Constants } from '@wth/shared/constant';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { WindowService } from '@wth/shared/services/window.service';

const PROFILE       = 'profile';
const PPROFILE      = 'pProfile'; // public profile
const SETTINGS      = 'settings';
const CONSTANTS      = 'constants';
const VERSION      = 'version';
const APPS      = 'apps';
const JWT           = 'jwt';
const LOGGEDIN      = 'logged_in';


@Injectable()
export class AuthService {
  // store the URL so we can redirect after logging in
  loggedIn: boolean;
  redirectUrl: string;
  user: any = null;
  jwt: string;
  EXP_TIME = 24 * 60 * 60 * 365 * 1000;

  user$: Observable<any>;
  loggedIn$: Observable<any>;

  private _user$: BehaviorSubject<any> = new BehaviorSubject({});
  private _loggedIn$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private cookieService: CookieService,
    private api: ApiBaseService,
    private windowService: WindowService,
    private userService: UserService // TODO will be remove after refactoring by AuthService

  ) {
    this.loggedIn$ = this._loggedIn$.asObservable();
    this.user$ = this._user$.asObservable();

    this.jwt = cookieService.get(JWT);
    this.loggedIn = Boolean(cookieService.get(LOGGEDIN));
    if (this.loggedIn) {
      let profile = cookieService.get(PROFILE);
      if (!profile) {
        this.loggedIn = false;
        this.deleteAuthInfo();
      } else {
        this.user = JSON.parse(String(profile));
        this._user$.next(this.user);
      }
      this._loggedIn$.next(this.loggedIn);
      //
      // this.api.post(`users/current_session/profile`, {jwt: `${cookieService.get(JWT)}`}).subscribe((response) => {
      //   this.loggedIn = true;
      //   this._loggedIn$.next(this.loggedIn);
      //   // this.loggedIn$ = this._loggedIn$.asObservable();
      //   this.user = response.data;
      //   this._user$.next(this.user);
      //   // this.user$ = this._user$.asObservable();
      //   this.storeLoggedInInfo();
      // }, (error) => {
      //   this.loggedIn = false;
      //   this._loggedIn$.next(this.loggedIn);
      //   // this.loggedIn$ = this._loggedIn$.asObservable();
      //
      //   this.deleteLoggedInInfo();
      // });
    } else {
      this.loggedIn = false;
      this._loggedIn$.next(this.loggedIn);
      // this.loggedIn$ = this._loggedIn$.asObservable();

      this.deleteLoggedInInfo();
    }
    this.windowService.watchStorage().subscribe((payload: any) => {
      this.user = payload.profile;
      this._user$.next(payload.profile);
    });
    window.addEventListener('cookie', (data: any) => {
      console.log('storage changed:::', data);
    });
  }

  login(payload: any): Observable<any> {
    return this.api.post('users/sign_in', payload).map
      ((response: any) => {
        this.jwt = response.token;
        this.loggedIn = true;
        this._loggedIn$.next(true);
        this.user = response.data;
        this._user$.next(this.user);
        this.storeAuthInfo();
      });
  }

  logout(): void {

    this.api.delete('users/sign_out').subscribe(
      response => {
        location.href = `${Constants.baseUrls.app}/login`;
      }, error => {
        console.log('logout error:::', error);
      }
    );
    this.jwt = null;
    this.loggedIn = false;
    this._loggedIn$.next(false);
    // this.loggedIn$ = this._loggedIn$.asObservable();
    this.user = null;
    this._user$.next({});
    // this.user$ = this._user$.asObservable();
    this.deleteAuthInfo();
  }

  isAuthenticated(): boolean {
    return this.loggedIn && this.jwt && this.user;
  }

  private storeAuthInfo() {
    let cookieOptionsArgs = {...Constants.cookieOptionsArgs, expires: new Date(new Date().getTime() + this.EXP_TIME)};

    // store in local storage
    this.storeLoggedInInfo();

    // store in session
    this.cookieService.put(JWT, this.jwt, cookieOptionsArgs);
    this.cookieService.put(LOGGEDIN, `${this.loggedIn}`, cookieOptionsArgs);
    this.cookieService.put(PROFILE, `${JSON.stringify(this.user)}`, cookieOptionsArgs);

  }


  private storeLoggedInInfo() {
    localStorage.setItem(PROFILE, JSON.stringify(this.user));
    localStorage.setItem(SETTINGS, '{}');
    localStorage.setItem(PPROFILE, '{}');
    localStorage.setItem(CONSTANTS, '{}');
    localStorage.setItem(VERSION, '1.0.0');
    localStorage.setItem(APPS, '{}');
  }

  private deleteAuthInfo() {

    let cookieOptionsArgs = {...Constants.cookieOptionsArgs, expires: new Date(new Date().getTime() + this.EXP_TIME)};

    this.deleteLoggedInInfo();

    // delete cookie datawt
    this.cookieService.remove(JWT, cookieOptionsArgs);
    this.cookieService.remove(LOGGEDIN, cookieOptionsArgs);
    this.cookieService.remove(PROFILE, cookieOptionsArgs);

  }

  private deleteLoggedInInfo() {
    let keys: Array<string> = [PROFILE, PPROFILE, SETTINGS, LOGGEDIN, CONSTANTS, VERSION, APPS];
    // delete local storage data
    keys.forEach((key) => {
      localStorage.removeItem(key);
    });
  }
}
