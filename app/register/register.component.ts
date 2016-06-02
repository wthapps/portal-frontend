import {Component}          from '@angular/core';
import {
  ROUTER_DIRECTIVES,
  Router
}                           from '@angular/router';
import {UserService}        from '../shared/services/user.service';

@Component({
  templateUrl: 'app/register/register.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ]
})

export class RegisterComponent {
  pageTitle:string = "Sign Up page";

  constructor(private _userService: UserService, private _router: Router){}

  public signup(
    event, 
    first_name, 
    last_name, 
    email, 
    password, 
    birthday_day, 
    birthday_month, 
    birthday_year, 
    sex, 
    accepted
  ){
    let body = JSON.stringify({
      first_name,
      last_name, 
      email, 
      password,
      birthday_day, 
      birthday_month ,
      birthday_year,
      sex: sex == undefined ? 0 : sex,
      accepted_policies: accepted
    });

    this._userService.signup('users', body)
      .subscribe((result) => {
        this._router.navigateByUrl('');
      },
      error => {
        console.log("error:", error);  
      });
  }
}