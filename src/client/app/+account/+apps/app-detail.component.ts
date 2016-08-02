import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';


@Component({
  moduleId: module.id,
  templateUrl: 'app-detail.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ]
})

export class AccountAppsDetailComponent {
  pageTitle:string = '';
}
