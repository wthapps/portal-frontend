import { Injectable }     from '@angular/core';
import { Router }         from '@angular/router';

import { Http, Response } from '@angular/http';
import { Observable }     from 'rxjs/Observable';

import { CookieService } from 'angular2-cookie/services/cookies.service';
import { CookieOptionsArgs } from 'angular2-cookie/services/cookie-options-args.model';

import { ApiBaseService } from './apibase.service';
import { User }           from '../models/user.model';
import { Constants } from '../config/constants';

@Injectable()
export class UserService extends ApiBaseService {

  loggedIn: boolean = false;
  profile: User = null;
  defaultPayment: any;

  private cookieOptionsArgs: CookieOptionsArgs = {
    path: '/',
    expires: new Date('2030-07-19')
  };

  constructor(http: Http, router: Router,
              private cookieService: CookieService) {
    super(http, router);
    this.readUserInfo();
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

  // get() {
  //   return super.post('users/get_user', '')
  //     .map(res => res.json())
  // }

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
    //2 Cookie.delete('jwt', '/');
    //2 Cookie.delete('logged_in', '/');
    //2 Cookie.delete('profile', '/');

    this.cookieService.removeAll();

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

    this.loggedIn = true;
    this.profile = response.data;
  }

  private readUserInfo() {
    if (this.cookieService.get('logged_in')) {
      this.profile = JSON.parse(this.cookieService.get('profile'));
      this.loggedIn = Boolean(this.cookieService.get('logged_in'));
    }
  }

  private updateProfile(profile: Object) {
    this.cookieService.put('profile', JSON.stringify(profile), this.cookieOptionsArgs);
  }
}


