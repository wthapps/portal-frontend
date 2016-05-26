import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';

@Component({
    templateUrl: 'app/login/login.component.html',
    directives: [
        ROUTER_DIRECTIVES
    ]
})

export class LoginComponent {
    constructor(private router:Router) {
    }

    onSubmit():void {
        this.router.navigate(['/account']);
    }
}