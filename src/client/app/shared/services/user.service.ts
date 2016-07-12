import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Http, Response} from '@angular/http';
import {Cookie}         from 'ng2-cookies/ng2-cookies';
import {ApiBaseService} from './apibase.service';
import {User}           from "../models/user.model";

@Injectable()
export class UserService extends ApiBaseService {

  loggedIn: boolean = false;
  profile: User = null;


  constructor(http: Http) {
    super(http);
    this.readUserInfo();
  }

  login(path: string, body: string, useJwt?: boolean = true): Observable<Response> {
    // public login(path: string, body: string, useJwt?: boolean = true) {
    return super.post(path, body)
      .map(res => res.json())
      .map((res) => {
        if(res) {
          this.storeUserInfo(res);
        }
        return res;
      });
  }

  logout(path: string): Observable<Response> {
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
  signup(path: string, body: string): Observable<Response> {
    return super.post(path, body)
      .map(res => res.json())
      .map((res) => {
        if(res) {
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
        .map(res => res.json())
        .map((res) => {
          if(res) {
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
      .map(res => res.json())
      .map((res) => {
        if(res) {

        }
        return res;
      });
  }

  choosePlan(path: string, body: string): Observable<Response> {
    return super.put(path, body)
      .map(res => res.json())
      .map((res) => {
        if(res) {
          this.updateProfile(res.data);
          this.readUserInfo();
        }
        return res;
      });
  }

  deleteUserInfo() {
    Cookie.delete('jwt');
    Cookie.delete('logged_in');
    Cookie.delete('profile');
    this.loggedIn = false;
    this.profile = null;
  }

  private storeUserInfo(response) {
    // TODO move string constants to config file
    Cookie.set('jwt', response.token);
    Cookie.set('profile', JSON.stringify(response.data));
    Cookie.set('logged_in', 'true');
    this.loggedIn = true;
    this.profile = response.data;
  }

  private readUserInfo() {
    this.profile = JSON.parse(Cookie.get('profile'));
    this.loggedIn = Boolean(Cookie.get('logged_in'));
  }

  private updateProfile(profile: Object) {
    Cookie.set('profile', JSON.stringify(profile));
  }

}


