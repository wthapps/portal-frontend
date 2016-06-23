import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {WthJoinUsComponent} from '../shared/wth.join.us.component';

@Component({
  moduleId: module.id,
  templateUrl: 'about.component.html',
  directives: [
    ROUTER_DIRECTIVES, WthJoinUsComponent
  ],
  styleUrls: ['about.component.css']
})

export class AboutComponent {
  pageTitle:string = 'About us';
}
