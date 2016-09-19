import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

@Component({
  moduleId: module.id,
  templateUrl: 'support.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ]
})

export class SupportComponent {
  pageTitle:string = 'Support Page';
}
