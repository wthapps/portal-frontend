import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

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
