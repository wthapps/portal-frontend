import { Component, Input, OnChanges } from '@angular/core';
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
  `
})
export class AppCardPlatformComponent implements OnChanges {
  @Input() data: any;

  platforms: any;

  ngOnChanges(): void {
    //console.log(this.data);
    this.platforms = this.data;
  }
}
