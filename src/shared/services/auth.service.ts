import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie';

import { UserService } from './user.service';
import { ApiBaseService } from './apibase.service';
import { Constants } from '@wth/shared/constant';
import { WindowService } from '@wth/shared/services/window.service';

const PPROFILE = 'pProfile'; // public profile
const SETTINGS = 'settings';
const CONSTANTS = 'constants';
const VERSION = 'version';
const APPS = 'apps';

@Injectable()
export class AuthService {
  // store the URL so we can redirect after logging in
  loggedIn: boolean;
  redirectUrl: string;
  user: any = null;
  jwt: string;
  EXP_TIME = 24 * 60 * 60 * 365 * 1000;

  user$: Observable<any>;
  loggedIn$: Observable<boolean>;

  private _user$: BehaviorSubject<any> = new BehaviorSubject({});
  private _loggedIn$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private cookieService: CookieService,
    private api: ApiBaseService,
    private windowService: WindowService
  ) {

    this.loggedIn$ = this._loggedIn$.asObservable();
    this.user$ = this._user$.asObservable();

    this.jwt = cookieService.get(Constants.cookieKeys.jwt);
    this.loggedIn = Boolean(cookieService.get(Constants.cookieKeys.loggedIn));

    // if (this.jwt) {
    //
    //   this.api.post(`users/current_session/profile`, {jwt: this.jwt}).subscribe((response) => {
    //     console.log('profile response::::');
    //     this.loggedIn = true;
    //     this._loggedIn$.next(this.loggedIn);
    //     this.user = response.data;
    //     this._user$.next(this.user);
    //     this.storeLoggedInInfo();
    //   }, (error) => {
    //     this.loggedIn = false;
    //     this._loggedIn$.next(this.loggedIn);
    //     this.deleteLoggedInInfo();
    //   });
    // }

    if (this.loggedIn) {
      const profile = cookieService.get(Constants.cookieKeys.profile);
      if (!profile) {
        this.loggedIn = false;
        this.deleteAuthInfo();
      } else {
        this.user = JSON.parse(String(profile));
        this._user$.next(this.user);
      }
      this._loggedIn$.next(this.loggedIn);

    } else {
      this.loggedIn = false;
      this._loggedIn$.next(this.loggedIn);
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
    return this.api.post('users/sign_in', payload).pipe(map((response: any) => {
      this.jwt = response.token;
      this.loggedIn = true;
      this._loggedIn$.next(true);
      this.user = response.data;
      this._user$.next(this.user);
      this.storeAuthInfo();
    }));
  }

  logout(): void {
    this.api.delete('users/sign_out').subscribe(
      response => {
        location.href = `${Constants.baseUrls.app}/login`;
      },
      error => {
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

  validateToken() {
    if (this.jwt) {
      this.api.post(`users/current_session/profile`, { jwt: this.jwt }).subscribe((response) => {
        this.loggedIn = true;
        this._loggedIn$.next(this.loggedIn);
        this.user = response.data;
        this._user$.next(this.user);
        this.storeLoggedInInfo();
      }, (error) => {
        this.loggedIn = false;
        this._loggedIn$.next(this.loggedIn);
        this.deleteLoggedInInfo();
      });
    }
  }

  private storeAuthInfo() {
    const cookieOptionsArgs = {
      ...Constants.cookieOptionsArgs,
      expires: new Date(new Date().getTime() + this.EXP_TIME)
    };

    // store in local storage
    this.storeLoggedInInfo();

    // store in session
    this.cookieService.put(Constants.cookieKeys.jwt, this.jwt, cookieOptionsArgs);
    this.cookieService.put(Constants.cookieKeys.loggedIn, `${this.loggedIn}`, cookieOptionsArgs);
    this.cookieService.put(
      Constants.cookieKeys.profile,
      `${JSON.stringify(this.user)}`,
      cookieOptionsArgs
    );
  }

  private storeLoggedInInfo() {
    localStorage.setItem(Constants.cookieKeys.profile, JSON.stringify(this.user));
    localStorage.setItem(SETTINGS, '{}');
    localStorage.setItem(PPROFILE, '{}');
    localStorage.setItem(CONSTANTS, '{}');
    localStorage.setItem(VERSION, '1.0.0');
    localStorage.setItem(APPS, '{}');
  }

  private deleteAuthInfo() {
    const cookieOptionsArgs = {
      ...Constants.cookieOptionsArgs,
      expires: new Date(new Date().getTime() + this.EXP_TIME)
    };

    this.deleteLoggedInInfo();

    // delete cookie datawt
    this.cookieService.remove(Constants.cookieKeys.jwt, cookieOptionsArgs);
    this.cookieService.remove(Constants.cookieKeys.loggedIn, cookieOptionsArgs);
    this.cookieService.remove(Constants.cookieKeys.profile, cookieOptionsArgs);
  }

  private deleteLoggedInInfo() {
    const keys: Array<string> = [
      Constants.cookieKeys.profile,
      PPROFILE,
      SETTINGS,
      Constants.cookieKeys.loggedIn,
      CONSTANTS,
      VERSION,
      APPS
    ];
    // delete local storage data
    keys.forEach(key => {
      localStorage.removeItem(key);
    });
  }
}
