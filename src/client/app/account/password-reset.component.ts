import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';

@Component({
  moduleId: module.id,
  templateUrl: 'password-reset.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ]
})

export class PasswordResetComponent {
  constructor(private router:Router) {
  }

  onSubmit():void {
    this.router.navigate(['/account/password_reset_complete']);
  }
}
