import {Component, Input, OnChanges} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {Platform} from '../../../shared/models/product.model';

/**
 * This class represents the AppCardSmComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'app-card-platform',
  template: `
          <ul class="platform">
            <li *ngFor="let c of platforms">
              <i class="fa fa-windows" [ngClass]="{
              'fa-windows': (c.name == 'windows' || c.name == 'windowsphone'), 
              'fa-apple': (c.name == 'macos' || c.name == 'ios'), 
              'fa-android': (c.name == 'android'), 
              'fa-desktop': (c.name == 'browser')}"></i>
            </li>
          </ul>
  `,
  directives: [ROUTER_DIRECTIVES]
})
export class AppCardPlatformComponent implements OnChanges {
  @Input() data: Array<Platform>;

  platforms: Array<Platform>;

  ngOnChanges(): void {
    //console.log(this.data);
    this.platforms = this.data;
  }
}
