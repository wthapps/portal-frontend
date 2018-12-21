import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
@Component({
  selector: 'card-item',
  templateUrl: 'card-item.component.html',
  styleUrls: ['card-item.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CardItemComponent {
  @Input() card: any;

  @Output() view = new EventEmitter<any>();

  onClick(): void {
    this.view.emit(this.card);
  }
}
