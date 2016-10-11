import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

@Component({
  moduleId: module.id,
  templateUrl: 'legal.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ]
})

export class SupportLegalComponent {
  pageTitle:string = 'Support Page';
}
