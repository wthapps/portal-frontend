import {
  Component,
  ViewEncapsulation,
  Input,
  Output,
  EventEmitter,
  ContentChild,
  TemplateRef,
  ViewChild,
  HostBinding,
  OnChanges, SimpleChanges
} from '@angular/core';
import { SelectContainerComponent } from 'ngx-drag-to-select';

@Component({
  selector: 'w-dataView',
  templateUrl: 'w-dataView.component.html',
  styleUrls: ['w-dataView.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class WDataViewComponent implements OnChanges {
  @HostBinding('class') class = 'objects-main-content';
  @Input() data: any;
  @Input() scrollWindow: false;
  @Input() sliderView = 3;
  @Input() viewMode = 'grid';
  @Input() disableDrag = false;
  @Input() selectOnDrag = false;
  @Output() selectCompleted: EventEmitter<any> = new EventEmitter<any>();
  @Output() loadMoreCompleted: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() dblClick: EventEmitter<any> = new EventEmitter<any>();
  @ContentChild('viewBody') viewBodyTmpl: TemplateRef<any>;
  @ContentChild('viewHeader') viewHeaderTmpl: TemplateRef<any>;
  @ViewChild('container') container: SelectContainerComponent;

  selectedDocuments: any;
  isUpdatedView: boolean;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('ngOnChanges:', changes);
  }

  onSelect(e: any) {
    this.selectCompleted.emit(e);
  }

  onLoadMore() {
    this.loadMoreCompleted.emit(true);
    this.container.update();
  }

  updateView() {
    this.isUpdatedView = true;
    this.container.clearSelection();
    setTimeout(() => {
      this.isUpdatedView = false;
      this.container.update();
    }, 200);
  }

  trackItem(index, item) {
    return item ? item.id : undefined;
  }
}
