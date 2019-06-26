import { Input, Component, ViewEncapsulation, EventEmitter, Output, ContentChild, TemplateRef } from '@angular/core';

@Component({
  selector: 'w-breadcrumbs',
  templateUrl: 'w-breadcrumbs.component.html',
  styleUrls: ['w-breadcrumbs.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class WBreadcrumbComponent {
  @Input() data: any[];
  @Input() max = 2;

  @Output() action: EventEmitter<any> = new EventEmitter<any>();

  @ContentChild('viewMenu') viewMenuTmpl: TemplateRef<any>;
  breadcrumbs: any[];

  constructor() {
  }

  onAction(event: any) {
    this.action.emit(event);
  }
}
