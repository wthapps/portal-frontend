import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

@Component({
  moduleId: module.id,
  templateUrl: 'register.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ]
})

export class RegisterComponent {
  pageTitle:string = 'Register page';
}
