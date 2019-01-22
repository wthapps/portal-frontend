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
  @Output() sliderViewCompleted: EventEmitter<number> = new EventEmitter<number>();
  @Output() sortComplete: EventEmitter<SortDataView> = new EventEmitter<SortDataView>(null);

  sortState = [
    {
      key: 'Name',
      value: 'Name'
    },
    {
      key: 'created_at',
      value: 'Upload Date'
    }
  ];

  sortBy = 'Name';
  orderBy = 'asc';

  onSlideChange(event: any) {
    this.sliderViewCompleted.emit(event.value);
  }

  onSort(sortBy, orderBy) {
    this.sortBy = sortBy;
    this.orderBy = orderBy;
    this.sortComplete.emit({ sortBy, orderBy });
  }
}
