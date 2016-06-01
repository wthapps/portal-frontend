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
                    localStorage.setItem('jwt', res.token);
                    // TODO store user's profile
                    this._loggedIn = true;
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
                this._loggedIn = false;
            });
    }
    
    public isLoggedIn(){
    	return this._loggedIn;
    }    
}