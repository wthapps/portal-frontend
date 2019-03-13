import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Response } from '@angular/http';
import { Observable ,  BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CookieService, CookieOptions } from 'ngx-cookie';

import { Constants } from '../constant/config/constants';

import { ApiBaseService } from './apibase.service';
import { User } from '../shared/models/user.model';
import { HttpClient } from '@angular/common/http';
import { WindowService } from '@wth/shared/services/window.service';

declare var _: any;

@Injectable()
export class UserService {
  loggedIn = false;

  defaultPayment: any;
  profile$: Observable<User>;
  notificationSetting$: Observable<any>;
  EXP_TIME = 24 * 60 * 60 * 365 * 1000;

  cookieOptionsArgs: CookieOptions = {
    ...Constants.cookieOptionsArgs,
    expires: new Date(new Date().getTime() + this.EXP_TIME)
  };
  // Please use getSyncProfile
  private profile: User = null;
  // Please use getAsyncProfile

  private readonly NOTIFICATION_SETTING_URL: string = 'users/notification_settings';
  private _profile: BehaviorSubject<any> = new BehaviorSubject<any>({});
  private _notificationSetting: BehaviorSubject<any> = new BehaviorSubject<any>(
    {}
  );

  constructor(
    private http: HttpClient,
    private router: Router,
    private apiBaseService: ApiBaseService,
    public cookieService: CookieService,
    private windowService: WindowService
  ) {
    this.readUserInfo();
    this.profile$ = this._profile.asObservable();
    this.notificationSetting$ = this._notificationSetting.asObservable();
  }

  login(path: string, body: string): Observable<Response> {
    return this.apiBaseService.post(path, body, { unauthen: true }).pipe(map(res => {
      if (res) {
        this.storeUserInfo(res);
      }
      return res;
    }));
  }

  logout(path: string): Observable<Response> {
    // public logout(path: string) {
    return this.apiBaseService.delete(path).pipe(map(res => {
      this.deleteUserInfo();
      return res;
    }));
  }

  /*
   * `sign up` new an account.
   */
  signup(path: string, body: string): Observable<Response> {
    return this.apiBaseService.post(path, body, { unauthen: true }).pipe(map(res => {
      if (res) {
        this.storeUserInfo(res);
      }
      return res;
    }));
  }

  /*
   * update user info
   * is_patch: You decide updating whole resource or a part of. Default value is false
   */
  update(body: any): Observable<Response> {
    return this.apiBaseService
      .patch(`users/${this.getSyncProfile().id}`, body)
      .pipe(map((res: any) => {
        if (res) {
          this.updateProfile(res.data);
          this.windowService.setItem({ profile: res.data });
          this.readUserInfo();
        }
        return res;
      }));
  }

  validateSession(): Observable<any> {
    return this.apiBaseService.post('users/get_user').pipe(map(() => {
      return { valid: true };
    }));
  }

  /*
   * change current password
   */
  changePassword(body: any): Observable<any> {
    return this.apiBaseService.patch('users/password/change', body).pipe(map(res => {
      return res;
    }));
  }

  choosePlan(path: string, body: string): Observable<Response> {
    return this.apiBaseService.put(path, body).pipe(map((res: any) => {
      if (res) {
        this.updateProfile(res.data);
        this.readUserInfo();
      }
      return res;
    }));
  }

  // permanently delete account
  deleteAccount(password: any): Observable<any> {
    return this.apiBaseService
      .patch(`users/delete_account`, {password: password})
      .pipe(map((res: any) => {
        return res;
      }));
  }

  deleteUserInfo() {
    this.cookieService.remove(Constants.cookieKeys.jwt, this.cookieOptionsArgs);
    this.cookieService.remove(Constants.cookieKeys.loggedIn, this.cookieOptionsArgs);
    this.cookieService.remove(Constants.cookieKeys.profile, this.cookieOptionsArgs);

    this.loggedIn = false;
    this.profile = null;
  }

  getDefaultPayment(): Observable<Response> {
    const userId = 1;
    const path = 'users/' + userId + '/payments';

    return this.apiBaseService.post(path, []).pipe(map((res: any) => {
      if (res) {
        this.storeDefaultPayment(res);
      }
      return res;
    }));
  }

  getSyncProfile() {
    return this._profile.getValue();
  }

  getAsyncProfile(): Observable<any> {
    return this.profile$;
  }

  validProfile() {
    return this.cookieService.get(Constants.cookieKeys.loggedIn) && this.cookieService.get(Constants.cookieKeys.profile);
  }

  isProfileUpdated(): boolean {
    if (this.cookieService.get(Constants.cookieKeys.loggedIn) && this.cookieService.get(Constants.cookieKeys.profile)) {
      const currentProfile = this.getSyncProfile();
      const latestProfile = JSON.parse(this.cookieService.get(Constants.cookieKeys.profile));
      return currentProfile.uuid !== latestProfile.uuid;
    } else return false;
  }

  updateProfile(profile: any) {
    this.cookieService.put(
      Constants.cookieKeys.profile,
      JSON.stringify(profile),
      this.cookieOptionsArgs
    );
    this.windowService.setItem({ profile: profile });
    this.setProfile(profile);
    // this.soUserProfile = {...this._soProfile.getValue(), profile_image: profile.profile_image};
  }

  getNotificationSetting() {
    if (!_.isEmpty(this._notificationSetting.getValue())) {
      console.warn(
        'Notification Setting value: ',
        this._notificationSetting.getValue()
      );
      return;
    }
    this.apiBaseService
      .post(`${this.NOTIFICATION_SETTING_URL}/index`)
      .pipe(map(res => res.data))
      .subscribe(this._notificationSetting);
  }

  updateNotificationSetting(body: any) {
    this.apiBaseService
      .post(`${this.NOTIFICATION_SETTING_URL}/update`, body)
      .pipe(map(res => res.data))
      .subscribe(this._notificationSetting);
  }

  resetNotificationSetting() {
    this.apiBaseService
      .post(`${this.NOTIFICATION_SETTING_URL}/reset`)
      .pipe(map(res => res.data))
      .subscribe(this._notificationSetting);
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

    this.cookieService.put(Constants.cookieKeys.jwt, response.token, this.cookieOptionsArgs);
    this.cookieService.put(Constants.cookieKeys.loggedIn, 'true', this.cookieOptionsArgs);
    this.cookieService.put(
      Constants.cookieKeys.profile,
      JSON.stringify(response.data),
      this.cookieOptionsArgs
    );

    this.loggedIn = true;
    this.profile = response.data;
    this._profile.next(Object.assign(this._profile.getValue(), response.data));
  }

  private readUserInfo() {
    if (this.cookieService.get(Constants.cookieKeys.loggedIn)) {
      if (this.cookieService.get(Constants.cookieKeys.profile)) {
        this.setProfile(JSON.parse(this.cookieService.get(Constants.cookieKeys.profile)));
      }
      this.loggedIn = Boolean(this.cookieService.get(Constants.cookieKeys.loggedIn));
    }
  }

  setProfile(profile: any) {
    this.profile = profile;
    this._profile.next(Object.assign(this._profile.getValue(), profile));
  }
}
