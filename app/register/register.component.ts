import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

@Component({
    templateUrl: 'app/register/register.component.html',
    directives: [
        ROUTER_DIRECTIVES
    ]
})

export class RegisterComponent {
    pageTitle:string = "Register page";
}