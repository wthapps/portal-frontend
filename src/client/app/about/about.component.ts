import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {WthJoinUs} from '../shared/wth.join.us.component';

@Component({
  moduleId: module.id,
  templateUrl: 'about.component.html',
  directives: [
    ROUTER_DIRECTIVES, WthJoinUs
  ],
  styleUrls: ['about.component.css']
})

export class AboutComponent {
  pageTitle:string = 'About us';
}
