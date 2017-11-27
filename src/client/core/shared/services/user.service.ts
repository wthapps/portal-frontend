import { Injectable }     from '@angular/core';
import { Router }         from '@angular/router';

import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { CookieService, CookieOptions } from 'ngx-cookie';

import { Constants } from '../config/constants';

import { ApiBaseService } from './apibase.service';
import { User }           from '../models/user.model';
import { UserInfo } from '../models/user/user-info.model';

@Injectable()
export class UserService extends ApiBaseService {

  loggedIn: boolean = false;
  profile: User = null;
  defaultPayment: any;

  public cookieOptionsArgs: CookieOptions = Constants.cookieOptionsArgs;

  public readonly profile$: Observable<any>;
  public readonly soProfile$: Observable<any>;
  private _profile: BehaviorSubject<any> = new BehaviorSubject<any>({});
  private _soProfile: BehaviorSubject<any> = new BehaviorSubject<any>(new UserInfo());
  constructor(http: Http, router: Router,
              public cookieService: CookieService) {
    super(http, router, cookieService);
    this.readUserInfo();

    this.profile$ = this._profile.asObservable();
    this.soProfile$ = this._soProfile.asObservable();
  }

  login(path: string, body: string, useJwt: boolean = true): Observable<Response> {
    // public login(path: string, body: string, useJwt?: boolean = true) {
    return super.post(path, body)
      .map((res) => {
        if (res) {
          this.storeUserInfo(res);
        }
        return res;
      });
  }


  logout(path: string): Observable<Response> {
    // public logout(path: string) {
    return super.delete(path)
      .map((res) => {
        this.deleteUserInfo();
        return res;
      });
  }

  /*
   * `sign up` new an account.
   */
  signup(path: string, body: string): Observable<Response> {
    return super.post(path, body)
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
  update(path: string, body: string): Observable<Response> {
    // if(is_patch){
    return super.patch(path, body)
      .map((res: any) => {
        if (res) {
          // update credit card into to profile
          // this.profile.credit_cards = res.credit_cards;
          // this.profile.billing_address = res.billing_address;
          /*console.log(res, this.profile);
           Cookie.set('profile', JSON.stringify(this.profile));*/
          // this.updateProfile(res.data);
          // this.readUserInfo();
          this.updateProfile(res.data);
          this.readUserInfo();
        }
        return res;
      });
    // }else{
    //   return super.put(path, body)
    //     .map(res => res.json())
    //     .map((res) => {
    //       if(res){

    //       }
    //       return res;
    //     });
    // }
  }

  /*
   * change current password
   */
  changePassword(path: string, body: string): Observable<Response> {
    return super.patch(path, body)
      .map((res) => {
        if (res) {
          console.log('changePassword:', res);
        }
        return res;
      });
  }

  choosePlan(path: string, body: string): Observable<Response> {
    return super.put(path, body)
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

    return super.post(path, [])
      .map((res: any) => {
        if (res) {
          this.storeDefaultPayment(res);
        }
        return res;
      });
  }

  getProfileUuid(): string {
    return this.profile != null ? this.profile.uuid : '';
  }

  set soUserProfile(data: any) {
    this._soProfile.next(data);
  }

  updateProfile(profile: any) {
    this.cookieService.put('profile', JSON.stringify(profile), this.cookieOptionsArgs);
    this.setProfile(profile);
    this.soUserProfile = {...this._soProfile.getValue(), profile_image: profile.profile_image};
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

    // TODO move string constants to config file
    this.cookieService.put('jwt', response.token, this.cookieOptionsArgs);
    this.cookieService.put('profile', JSON.stringify(response.data), this.cookieOptionsArgs);
    this.cookieService.put('logged_in', 'true', this.cookieOptionsArgs);
    this.cookieService.put(Constants.cookieKeys.chatSupportId,  response.data.uuid, this.cookieOptionsArgs);

    this.loggedIn = true;
    this.profile = response.data;
  }

  private readUserInfo() {
    if (this.cookieService.get('logged_in')) {
      this.setProfile(JSON.parse(this.cookieService.get('profile')));

      this.loggedIn = Boolean(this.cookieService.get('logged_in'));
    }
  }

  private setProfile(profile: any) {
    this.profile = profile;
    this._profile.next(Object.assign(this._profile.getValue(), profile));
    console.debug('inside setProfile: ', this._profile);
  }
}


