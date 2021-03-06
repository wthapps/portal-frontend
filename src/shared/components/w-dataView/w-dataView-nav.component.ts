import { Component, HostBinding, Output, EventEmitter, Input } from '@angular/core';

export interface SortDataView {
  sortBy: string;
  orderBy: string;
}

@Component({
  selector: 'w-dataView-nav',
  templateUrl: 'w-dataView-nav.component.html'
})
export class WDataViewNavComponent {
  @HostBinding('class') class = 'objects-main-nav';
  @Input() sliderView;
  @Input() showViewMode;
  @Input() enableSort = true;
  @Input() viewBy = 'grid';
  @Input() sortBy = 'name';
  @Input() orderBy = 'asc';
  @Input() sortState = [
    {
      key: 'name',
      value: 'Name'
    },
    {
      key: 'updated_at',
      value: 'Last modified'
    }
  ];

  @Output() sliderViewCompleted: EventEmitter<number> = new EventEmitter<number>();
  @Output() sortComplete: EventEmitter<SortDataView> = new EventEmitter<SortDataView>(null);
  @Output() viewComplete: EventEmitter<string> = new EventEmitter<string>(null);


  viewState = [
    {
      key: 'grid',
      icon: 'fa fa-th-large',
      value: 'Grid'
    },
    {
      key: 'list',
      icon: 'fa fa-th-list',
      value: 'List'
    }
  ];

  onSlideChange(event: any) {
    this.sliderViewCompleted.emit(event.value);
  }

  onSort(sortBy, orderBy) {
    this.sortBy = sortBy;
    this.orderBy = orderBy;
    this.sortComplete.emit({ sortBy, orderBy });
  }

  onView(view) {
    this.viewBy = view;
    this.viewComplete.emit(view);
  }
}
