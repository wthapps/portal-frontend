import {Injectable} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {Http, Response} from '@angular/http'
import {ApiBaseService} from "./apibase.service";


@Injectable()
export class UserService extends ApiBaseService {

	private _loggedIn: boolean = false;

	constructor(http: Http){
		super(http);
		this._loggedIn = !!localStorage.getItem('jwt');
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
        this._loggedIn = true;
    }    
}