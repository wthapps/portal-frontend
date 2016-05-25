import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

@Component({
    templateUrl: 'app/login/login.component.html',
    directives: [
        ROUTER_DIRECTIVES
    ]
})

export class LoginComponent {
    pageTitle:string = "Login page";
}