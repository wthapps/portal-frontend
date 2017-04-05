import { Component, Input, EventEmitter, Output } from '@angular/core';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-media-share-sortbar',
  templateUrl: 'sortbar.component.html'
})

export class ZMediaSortbarComponent {
  @Input() data: any;
  @Input() view: any;
  @Output() outEvent: EventEmitter<any> = new EventEmitter<any>();

  sortName: any = "Date";
  sort: any = "desc";

  setSortName(name:any) {
    this.sortName = name;
  }

  toggleSort() {
    if (this.sort == "asc") {
      this.sort = "desc"
    } else {
      this.sort = "asc"
    }
  }

  doSort() {
    this.outEvent.emit({action: 'sort', data: {sort: this.sort, sort_name: this.sortName}});
  }

  group(groupBy:any) {
    this.outEvent.emit({action: 'group', data: groupBy});
  }
}
