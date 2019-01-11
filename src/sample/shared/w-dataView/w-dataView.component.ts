import { Component, ViewEncapsulation, Input, Output, EventEmitter, ContentChild, TemplateRef } from '@angular/core';

@Component({
  selector: 'w-dataView',
  templateUrl: 'w-dataView.component.html',
  styleUrls: ['w-dataView.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WDataViewComponent {
  @Input() data: any;
  @Output() loadMoreCompleted: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ContentChild('viewBody') viewBodyTmpl: TemplateRef<any>;
  selectedDocuments: any;

  constructor() {
  }

  someMethod(e: any) {
    // console.log(e);
  }

  onLoadMore() {
    console.log('onLoadMore');
    this.loadMoreCompleted.emit(true);
  }
}
