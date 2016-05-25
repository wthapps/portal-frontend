import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';

@Component({
    templateUrl: 'app/account/forgot-password.component.html',
    directives: [
        ROUTER_DIRECTIVES
    ]
})

export class ForgotPasswordComponent {

    constructor(private router:Router) {
    }
    
    onSubmit():void {
        this.router.navigate(['/account/reset_email_sent']);
    }
}