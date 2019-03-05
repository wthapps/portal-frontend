import {
  Component,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter,
  ContentChild,
  TemplateRef,
  ViewChild,
  HostBinding
} from '@angular/core';
import { SelectContainerComponent } from 'ngx-drag-to-select';

@Component({
  selector: 'w-dataView',
  templateUrl: 'w-dataView.component.html',
  styleUrls: ['w-dataView.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WDataViewComponent {
  @HostBinding('class') class = 'objects-main-content';
  @Input() data: any;
  @Input() scrollWindow: false;
  @Input() sliderView = 3;
  @Input() viewMode = 'grid';
  @Output() selectCompleted: EventEmitter<any> = new EventEmitter<any>();
  @Output() loadMoreCompleted: EventEmitter<boolean> = new EventEmitter<boolean>();
  @ContentChild('viewBody') viewBodyTmpl: TemplateRef<any>;
  @ContentChild('viewHeader') viewHeaderTmpl: TemplateRef<any>;
  @ViewChild('container') container: SelectContainerComponent;

  selectedDocuments: any;

  constructor() {
  }

  onSelect(e: any) {
    this.selectCompleted.emit(e);
  }

  onLoadMore() {
    this.loadMoreCompleted.emit(true);
    this.updateSelect();
  }

  updateSelect() {
    this.container.update();
  }
}
