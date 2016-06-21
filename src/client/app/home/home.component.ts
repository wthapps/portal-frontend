import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {UserService} from "../shared/services/user.service";
import {WthJoinUs} from '../shared/wth.join.us.component';

@Component({
  moduleId: module.id,
  templateUrl: 'home.component.html',
  directives: [
    ROUTER_DIRECTIVES, WthJoinUs
  ]
})

export class HomeComponent {
  pageTitle:string = 'Home page';
  
  constructor(private _userService: UserService){}
}
