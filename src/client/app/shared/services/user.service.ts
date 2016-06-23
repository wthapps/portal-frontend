import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Http, Response} from '@angular/http';
import {Cookie}         from 'ng2-cookies/ng2-cookies'
import {ApiBaseService} from './apibase.service';

@Injectable()
export class UserService extends ApiBaseService {

  public loggedIn: boolean = false;
  public profile: User = null;


  constructor(http: Http) {
    super(http);
    this.readUserInfo();
  }

  public login(path: string, body: string, useJwt?: boolean = true): Observable<Response>{
    // public login(path: string, body: string, useJwt?: boolean = true) {
    return super.post(path, body)
      .map(res => res.json())
      .map((res) => {
        if(res){
          this.storeUserInfo(res)
        }
        return res;
      });
  }

  public logout(path: string): Observable<Response>{
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
  public signup(path: string, body: string): Observable<Response>{
    return super.post(path, body)
      .map(res => res.json())
      .map((res) => {
        if(res){
          this.storeUserInfo(res);
        }
        return res;
      });
  }

  /*
  * update user info
  * is_patch: You decide updating whole resource or a part of. Default value is false
  */
  public update(path: string, body: string): Observable<Response>{
    // if(is_patch){
      return super.patch(path, body)
        .map(res => res.json())
        .map((res) => {
          if(res){
            // update credit card into to profile
            // this.profile.credit_cards = res.credit_cards;
            // this.profile.billing_address = res.billing_address;
            Cookie.set('profile', JSON.stringify(this.profile));
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
  public changePassword(path: string, body: string): Observable<Response>{
    return super.patch(path, body)
      .map(res => res.json())
      .map((res) => {
        if(res){

        }
        return res;
      });
  }

  public choosePlan(path: string, body: string): Observable<Response>{
    return super.put(path, body)
      .map(res => res.json())
      .map((res) => {
        if(res){
          this.updateProfile(res.data);
          this.readUserInfo();
        }
        return res;
      });
  }

  private storeUserInfo(response){
    // TODO move string constants to config file
    Cookie.set('jwt', response.token);
    Cookie.set('profile', JSON.stringify(response.data));
    Cookie.set('logged_in', 'true');
    this.loggedIn = true;
    this.profile = response.data;
  }

  private readUserInfo(){
    this.profile = JSON.parse(Cookie.get('profile'));
    this.loggedIn = Boolean(Cookie.get('logged_in'));
  }

  private deleteUserInfo(){
    Cookie.delete('jwt');
    Cookie.delete('logged_in');
    Cookie.delete('profile');
    this.loggedIn = false;
    this.profile = null;
  }

  private updateProfile(profile: Object){
    Cookie.set('profile', JSON.stringify(profile));
  }

}

export class Ibilling_address {
  constructor(
    public address_line_1: string,
    public address_line_2: string,
    public country: string,
    public city: string,
    public postcode: string,
    public region: string
  ) {}
}

export class User {
  constructor(
    public id: number,
    public first_name: string,
    public last_name: string,
    public email: string,
    public password: string,
    public birthday: string,
    public birthday_day: string,
    public birthday_month: string,
    public birthday_year: string,
    public sex: number,
    public accepted: boolean,
    public has_payment_info: boolean,
    public billing_address: Object,
    public credit_cards:Array<any>
  ) {}
}
