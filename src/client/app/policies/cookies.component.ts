import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES, Router} from '@angular/router';
import {UserService, CONFIG}  from '../../shared/index';

@Component({
  moduleId: module.id,
  templateUrl: 'cookies.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ]
})

export class CookiesComponent {
  pageTitle:string = 'Cookies';
  
}
