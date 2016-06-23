import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'policies-menu',
  templateUrl: 'menu.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ]
})

export class PoliciesMenuComponent {
}
