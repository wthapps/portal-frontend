import {Component, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {IAppCard} from './app-card';

/**
 * This class represents the AppCardMdComponent.
 */
@Component({
  moduleId: module.id,
  selector: 'app-card-md',
  template: `
    <div class="app-card-md">
      <a href="javascript:;" (click)='onClick()'>
        <div class="app-card-cover">
          <figure>
            <img [src]="card.img" [alt]="card.name">
          </figure>
        </div>
        <div class="app-card-content">
          <p class="name">{{card.name}}</p>
          <p class="cat">{{card.category}}</p>
          <ul class="flatform">
            <li *ngFor="let c of card.flatform">
              <i class="fa fa-windows" [ngClass]="{
              'fa-windows': (c == 'windows'), 
              'fa-apple': (c == 'apple'), 
              'fa-desktop': (c == 'browser')}"></i>
            </li>
          </ul>
        </div>
      </a>
    </div>
  `,
  directives: [ROUTER_DIRECTIVES]
})
export class AppCardMdComponent implements OnChanges {
  @Input() data: IAppCard;

  @Output() appCardClicked: EventEmitter<number> = new EventEmitter<number>();

  card: IAppCard;

  cardId: number = 0;

  ngOnChanges(): void {
    this.card = this.data;
    this.cardId = this.data.id;
  }

  onClick(): void {
    this.appCardClicked.emit(this.cardId);
  }
}
