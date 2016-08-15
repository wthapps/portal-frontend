import {Component, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {Product} from '../../shared/models/product.model';
import {AppCardPlatformComponent} from './platform/app-card-platform.component';
import {Constants} from '../../shared/index';

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
            <img [src]="card.img_src" (error)="checkError($event)" [alt]="card.display_name">
          </figure>
        </div>
        <div class="app-card-content">
          <p class="name">{{card.display_name}}</p>
          <p class="cat">{{card.category.name}}</p>
          <app-card-platform [data]="card.platforms"></app-card-platform>
        </div>
      </a>
    </div>
  `,
  directives: [
    ROUTER_DIRECTIVES,
    AppCardPlatformComponent
  ]
})
export class AppCardComponent implements OnChanges {
  @Input() data: Product = new Product();
  @Input() type: string = 'small';

  @Output() appCardClicked: EventEmitter<number> = new EventEmitter<number>();

  card: Product;

  cardId: number = 0;

  category: string = '';

  errorMessage: string = '';

  ngOnChanges(): void {
    this.card = this.data;
    this.cardId = this.data.id;
  }

  onClick(): void {
    this.appCardClicked.emit(this.cardId);
  }

  checkError(event) {
    if (event.type == 'error') {
      event.target.src = Constants.img.app;
    }
  }
}
