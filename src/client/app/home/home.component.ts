import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {UserService} from '../shared/services/user.service';

@Component({
  moduleId: module.id,
  templateUrl: 'home.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ]
})

export class HomeComponent {
  pageTitle:string = 'Home page';

  constructor(private _userService:UserService) {
  }
}
