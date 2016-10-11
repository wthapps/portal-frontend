import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

@Component({
  moduleId: module.id,
  templateUrl: 'security.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ]
})

export class SupportSecurityComponent {
  pageTitle:string = 'Support Page';
}
