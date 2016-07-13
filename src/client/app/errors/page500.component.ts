import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

@Component({
  moduleId: module.id,
  templateUrl: 'page500.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ]
})

export class Page500Component {
  PanelTitle:string = '500';
}
