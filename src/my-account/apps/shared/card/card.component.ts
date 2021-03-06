import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Product } from '@wth/shared/shared/models/product.model';
import { Constants } from '@wth/shared/constant/config/constants';

/**
 * This class represents the AppCardSmComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'my-apps-shared-card',
  template: `
    <div *ngIf="data" class="app-card" [ngClass]="{'app-card-sm': (type == 'small'), 'app-card-md': (type == 'medium')}">
      <a href="javascript:;" (click)='onClick(data.id)'>
        <div class="app-card-cover">
          <figure>
            <img [src]="data.img_src" (error)="checkError($event)" [alt]="data.display_name">
          </figure>
        </div>
        <div class="app-card-content">
          <p class="name">{{ data.display_name }}</p>
          <p class="cat">{{ data.category.name }}</p>
          <my-apps-shared-platform [data]="data.platforms"></my-apps-shared-platform>
        </div>
      </a>
    </div>
  `
})
export class MyAppsSharedCardComponent {
  @Input() data: Product = new Product();
  @Input() type: string = 'small';

  @Output() appCardClicked: EventEmitter<number> = new EventEmitter<number>();

  category: string = '';

  errorMessage: string = '';

  onClick(id: any): void {
    this.appCardClicked.emit(id);
  }

  checkError(event: any) {
    if (event.type == 'error') {
      event.target.src = Constants.img.app;
    }
  }
}
