import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { CookieService, CookieOptions } from 'ngx-cookie';

import { Constants } from '../constant/config/constants';

import { ApiBaseService } from './apibase.service';
import { User } from '../shared/models/user.model';
import { UserInfo } from '../shared/models/user/user-info.model';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserService {

  loggedIn: boolean = false;

  defaultPayment: any;

  public cookieOptionsArgs: CookieOptions = Constants.cookieOptionsArgs;
  // Please use getSyncProfile
  private profile: User = null;
  // Please use getAsyncProfile
  private readonly profile$: Observable<any>;
  private readonly EXP_TIME_MS = 24*60*60*365*1000;
  private _profile: BehaviorSubject<any> = new BehaviorSubject<any>({});
  constructor(private http: HttpClient,
              private router: Router,
              private apiBaseService: ApiBaseService,
              public cookieService: CookieService) {
    this.readUserInfo();
    this.profile$ = this._profile.asObservable();
  }

  login(path: string, body: string): Observable<Response> {
    return this.apiBaseService.post(path, body, {unauthen: true})
      .map((res) => {
        if (res) {
          this.storeUserInfo(res);
        }
        return res;
      });
  }


  logout(path: string): Observable<Response> {
    // public logout(path: string) {
    return this.apiBaseService.delete(path)
      .map((res) => {
        this.deleteUserInfo();
        return res;
      });
  }

  /*
   * `sign up` new an account.
   */
  signup(path: string, body: string): Observable<Response> {
    return this.apiBaseService.post(path, body, {unauthen: true})
      .map((res) => {
        if (res) {
          this.storeUserInfo(res);
        }
        return res;
      });
  }

  /*
   * update user info
   * is_patch: You decide updating whole resource or a part of. Default value is false
   */
  update(body: any): Observable<Response> {
    return this.apiBaseService.patch(`users/${this.getSyncProfile().id}`, body)
      .map((res: any) => {
        if (res) {
          this.updateProfile(res.data);
          this.readUserInfo();
        }
        return res;
      });
  }

  validateSession(): Observable<any> {
    return this.apiBaseService.post('users/get_user').map(() => { return {valid: true}});
  }
  /*
   * change current password
   */
  changePassword(path: string, body: string): Observable<Response> {
    return this.apiBaseService.patch(path, body)
      .map((res) => {
        if (res) {
          console.log('changePassword:', res);
        }
        return res;
      });
  }

  choosePlan(path: string, body: string): Observable<Response> {
    return this.apiBaseService.put(path, body)
      .map((res: any) => {
        if (res) {
          this.updateProfile(res.data);
          this.readUserInfo();
        }
        return res;
      });
  }

  deleteUserInfo() {
    this.cookieService.remove('jwt', this.cookieOptionsArgs);
    this.cookieService.remove('logged_in', this.cookieOptionsArgs);
    this.cookieService.remove('profile', this.cookieOptionsArgs);

    this.loggedIn = false;
    this.profile = null;
  }

  getDefaultPayment(): Observable<Response> {
    let userId = 1;
    let path = 'users/' + userId + '/payments';

    return this.apiBaseService.post(path, [])
      .map((res: any) => {
        if (res) {
          this.storeDefaultPayment(res);
        }
        return res;
      });
  }

  getSyncProfile() {
    let sub = this.profile$.subscribe((profile: any) => {
      this.profile = profile
    })
    sub.unsubscribe();
    return this.profile;
  }

  getAsyncProfile() {
    return this.profile$;
  }

  updateProfile(profile: any) {
    this.cookieService.put('profile', JSON.stringify(profile), this.cookieOptionsArgs);
    this.setProfile(profile);
    // this.soUserProfile = {...this._soProfile.getValue(), profile_image: profile.profile_image};
  }

  private storeDefaultPayment(response: any) {
    // Check if profile_image is null
    if (response.user.default_payment) {
      this.defaultPayment = response.user.default_payment;
    }

  }


  private storeUserInfo(response: any) {
    // Check if profile_image is null
    if (!response.data.profile_image) {
      response.data.profile_image = Constants.img.avatar;
    }

    let cookieOptionsArgs = {...this.cookieOptionsArgs, expires: new Date( new Date().getTime() + this.EXP_TIME_MS)};

    // TODO move string constants to config file
    this.cookieService.put('jwt', response.token, cookieOptionsArgs);
    this.cookieService.put('profile', JSON.stringify(response.data), cookieOptionsArgs);
    this.cookieService.put('logged_in', 'true', cookieOptionsArgs);
    this.cookieService.put(Constants.cookieKeys.chatSupportId,  response.data.uuid, cookieOptionsArgs);

    this.loggedIn = true;
    this.profile = response.data;
    this._profile.next(Object.assign(this._profile.getValue(), response.data));
  }

  private readUserInfo() {
    if (this.cookieService.get('logged_in')) {
      if (this.cookieService.get('profile'))
        this.setProfile(JSON.parse(this.cookieService.get('profile')));

      this.loggedIn = Boolean(this.cookieService.get('logged_in'));
    }
  }

  setProfile(profile: any) {
    this.profile = profile;
    this._profile.next(Object.assign(this._profile.getValue(), profile));
  }

  setProfileByKey(key: any, data: any) {
    this.profile = this._profile.getValue()
    this.profile[key] = data;
    this._profile.next(Object.assign(this.profile));
  }
}
