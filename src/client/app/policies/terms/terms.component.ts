import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

@Component({
  moduleId: module.id,
  templateUrl: 'terms.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ]
})

export class TermsComponent {
  PanelTitle:string = 'WTH Terms of Service';
}
