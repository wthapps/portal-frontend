import {Injectable} from '@angular/core';
import {ApiBaseService} from "./apibase.service";
import {Observable} from "rxjs/Observable";
import {Http, Response} from '@angular/http'

@Injectable()
export class UserService extends ApiBaseService {

	private _loggedIn: boolean false;

	constructor(http: Http){
		super(http);
		this._loggedIn = !!localStorage.getItem('jwt');
	}
    
    public login(path: string, body: string, useJwt?: boolean = true): Observable<Response>{
        return super.post(path, body);                    
    }

    public logout(path: string): Observable<Response>{
        return super.delete(path);                    
    }
    
    isLoggedIn(){
    	return this._loggedIn;
    }
}