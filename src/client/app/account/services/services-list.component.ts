import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

@Component({
  moduleId: module.id,
  templateUrl: 'services-list.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ]
})

export class AccountServicesListComponent {
  PanelTitle:string = 'Find Services';
}
