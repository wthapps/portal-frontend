import {Component}              from '@angular/core';
import {ROUTER_DIRECTIVES}      from '@angular/router';
import {
  WthJoinUsComponent,
  getStartedComponent
}                               from '../shared/wth.join.us.component';

@Component({
  moduleId: module.id,
  templateUrl: 'home.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    WthJoinUsComponent,
    getStartedComponent
  ]
})

export class HomeComponent {
  pageTitle:string = 'Home page';
}
