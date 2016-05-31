import {Component} 		from '@angular/core';
import {
	ROUTER_DIRECTIVES,
	Router,
	RouteSegment} 		from '@angular/router';
import {UserService}    from '../shared/services/user.service';


@Component({
    templateUrl: 'app/login/login.component.html',
    directives: [
        ROUTER_DIRECTIVES
    ]
})


export class LoginComponent {	

	// TODO Consider replacing RouteSegment  by RouteParams when Angular 2 version will be released
    constructor(
		private _router: Router,
		private _userService: UserService,
		private _params: RouteSegment
	) {
		this._backUrl = this._params.parameters['back_url'];
    }

    onSubmit():void {
        this._router.navigate(['/account']);
    }

    login(email, password){		
		
		let body = JSON.stringify({user: {email, password}});
		this._userService.login('users/sign_in', body, false)
			.subscribe(
				response => {
					localStorage.setItem('jwt', response.json().token);
					
					// navigate to previous page
					this._router.navigate([this._backUrl]);
				},
				error => {
					console.log("login error:", "error");
				}
			);
	}
	
}





