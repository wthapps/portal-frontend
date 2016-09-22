import {
  Component
}                                 from '@angular/core';
import {
  ROUTER_DIRECTIVES
}                                 from '@angular/router';

import {
  ZoneMenuComponent
}                                 from './menu.component';

@Component({
  moduleId: module.id,
  selector: 'page-zone',
  templateUrl: 'zone.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    ZoneMenuComponent
  ]
})
export class ZoneComponent {
  pageTitle: string = 'Zone';
}
