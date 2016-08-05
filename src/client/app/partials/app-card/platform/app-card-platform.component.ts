import {Component, Input, OnChanges} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {Product, Platform} from '../../../shared/models/product.model';
import {AppCardService} from '../app-card.service';

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
  directives: [ROUTER_DIRECTIVES],
  viewProviders: [
    AppCardService
  ]
})
export class AppCardPlatformComponent implements OnChanges {
  @Input() data: Product;

  platforms: Array<Platform>;

  constructor(private appCardService: AppCardService) {
  }

  ngOnChanges(): void {
    if (this.data.id) {
      this.appCardService.get(`products/${this.data.id}/platforms`).subscribe(
        (res: any) => {
          this.platforms = res.data;
        },
        error => console.log(<any>error)
      );
    }
  }
}
