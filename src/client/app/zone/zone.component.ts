import { Component, HostBinding } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'page-zone',
  templateUrl: 'zone.component.html'
})

export class ZoneComponent {
  zoneClass: boolean = true;
  @HostBinding('class.main-page') zoneClass;
}
