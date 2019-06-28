import { Input, Component, ViewEncapsulation, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'w-breadcrumbs-lite',
  templateUrl: 'w-breadcrumbs-lite.component.html',
  styleUrls: ['w-breadcrumbs-lite.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class WBreadcrumbsLiteComponent {
  @Input() data: any[];
  @Input() max = 2;

  @Output() action: EventEmitter<any> = new EventEmitter<any>();

  breadcrumbs: any[];

  constructor() {
  }

  onAction(event: any) {
    this.action.emit(event);
  }
}
