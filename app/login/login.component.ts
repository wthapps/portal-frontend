import {Component} 									from '@angular/core';
import {ROUTER_DIRECTIVES, Router} 					from '@angular/router';
import {Http, Headers, RequestOptions, Response, RequestMethod, Request} 	from '@angular/http';

@Component({
    templateUrl: 'app/login/login.component.html',
    directives: [
        ROUTER_DIRECTIVES
    ]
})


export class LoginComponent {

	

    constructor(private router:Router, public _http:Http) {}

    onSubmit():void {
        this.router.navigate(['/account']);
    }

    login(email, password){
    	this.url = "http://localhost:4000/users/sign_in";
		// this.headers = new Headers();
		// this.headers.append("Content-Type", 'application/json');
		// this.headers.append("Authorization", "Bearer " + "ABCD"); // localStorage.getItem('key_store_in_browser')
		// this.body = {"user": JSON.stringify({email, password})};

		this.body = JSON.stringify({user: {email, password}});
	    let headers = new Headers({ 'Content-Type': 'application/json' });
	    let options = new RequestOptions({ headers: headers });

		this._http.post(this.url, this.body, options)
			.subscribe(
				response => {
					localStorage.setItem('jwt', response.json().token);
					this.router.navigate('/');
				},
				error => {
					console.log("error");
				}
			); 		
	}	
	
}





