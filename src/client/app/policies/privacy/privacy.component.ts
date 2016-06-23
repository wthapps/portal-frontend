import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

@Component({
  moduleId: module.id,
  templateUrl: 'privacy.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ]
})

export class PrivacyComponent {
  PanelTitle:string = 'Welcome to the WTH Privacy Policy';
}
