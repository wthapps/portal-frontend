import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';

@Component({
  moduleId: module.id,
  templateUrl: 'forgot-password.component.html',
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
