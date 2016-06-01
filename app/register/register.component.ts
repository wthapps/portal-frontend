import {Component}          from '@angular/core';
import {ROUTER_DIRECTIVES}  from '@angular/router';
import {UserService}        from '../shared/services/user.service';

@Component({
    templateUrl: 'app/register/register.component.html',
    directives: [
        ROUTER_DIRECTIVES
    ]
})

export class RegisterComponent {
    pageTitle:string = "Register page";

    constructor(private _userService: UserService){}

    public signup(event, firstname, lastname, email, password, accepted){
      let body = JSON.stringify({first_name12121: firstname, last_name: lastname, email, password, accepted});
      this._userService.signup('users', body)
      .subscribe((result) => {
          console.log("signedup");
        },
        error =>{
          console.log("error:", error);  
        });
    }
}