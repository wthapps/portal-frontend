import {Component, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {Product, Platform} from '../../shared/models/product.model';
import {AppCardPlatformComponent} from './platform/app-card-platform.component';
import {AppCardCategoryComponent} from './category/app-card-category.component';
import {AppCardService} from './app-card.service';

/**
 * This class represents the AppCardSmComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'app-card',
  template: `
    <div class="app-card" [ngClass]="{'app-card-sm': (type == 'small'), 'app-card-md': (type == 'medium')}">
      <a href="javascript:;" (click)='onClick()'>
        <div class="app-card-cover">
          <figure>
            <img [src]="card.img_src" [alt]="card.display_name">
          </figure>
        </div>
        <div class="app-card-content">
          <p class="name">{{card.display_name}}</p>
          <app-card-category [data]="card"></app-card-category>
          <app-card-platform [data]="card"></app-card-platform>
        </div>
      </a>
    </div>
  `,
  directives: [
    ROUTER_DIRECTIVES,
    AppCardCategoryComponent,
    AppCardPlatformComponent
  ],
  viewProviders: [
    AppCardService
  ]
})
export class AppCardComponent implements OnChanges {
  @Input() data: Product;
  @Input() type: string = 'small';

  @Output() appCardClicked: EventEmitter<number> = new EventEmitter<number>();

  card: Product;

  cardId: number = 0;

  category: string = '';

  errorMessage: string = '';

  constructor(private appCardService: AppCardService) {
  }

  ngOnChanges(): void {
    this.card = this.data;
    this.cardId = this.data.id;
    console.log(this.data.product_categories_id);
  }

  onClick(): void {
    this.appCardClicked.emit(this.cardId);
  }
}
