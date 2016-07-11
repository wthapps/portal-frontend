import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

@Component({
  moduleId: module.id,
  templateUrl: 'support.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ],
  styleUrls: ['support.component.css']
})

export class SupportComponent {
  pageTitle:string = 'Support Page';
}
