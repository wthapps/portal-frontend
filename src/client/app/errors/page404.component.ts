import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

@Component({
  moduleId: module.id,
  templateUrl: 'page404.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ]
})

export class Page404Component {
  PanelTitle:string = '404';
}
