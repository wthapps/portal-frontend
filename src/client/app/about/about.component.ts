import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

@Component({
  moduleId: module.id,
  templateUrl: 'about.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ],
  styleUrls: ['about.component.css']
})

export class AboutComponent {
  pageTitle:string = 'About us';
}
