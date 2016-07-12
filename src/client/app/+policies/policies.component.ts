import {Component}                from '@angular/core';
import {
  ROUTER_DIRECTIVES
}                                 from '@angular/router';
import {PoliciesMenuComponent}    from './menu.component';

@Component({
  moduleId: module.id,
  templateUrl: 'policies.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    PoliciesMenuComponent
  ]
})

export class PoliciesComponent {
}
