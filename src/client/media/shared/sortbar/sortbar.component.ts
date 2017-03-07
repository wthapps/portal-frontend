import { Component, Input, EventEmitter, Output } from '@angular/core';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-media-share-sortbar',
  templateUrl: 'sortbar.component.html'
})

export class ZMediaSortbarComponent {
  @Input() data: any;
  @Output() outEvent: EventEmitter<any> = new EventEmitter<any>();

  sortName: any = false;
  sortDate: any = false;

  onAction(action: string) {
    switch (action) {
      case 'sort-name':
        this.onSortName();
        break;
      case 'sort-date':
        this.onSortDate();
        break;
      default:
        break;
    }
    return false;
  }

  private onSortName() {
    this.sortDate = false;
    this.sortName = (this.sortName == 'desc') ? 'asc' : 'desc';

    if (this.sortName == 'asc') {
      this.outEvent.emit(_.sortBy(this.data, ['name']));
    } else {
      this.outEvent.emit(_.reverse(_.sortBy(this.data, ['name'])));
    }
    // console.log('onSortName');
  }

  private onSortDate() {
    this.sortName = false;
    this.sortDate = (this.sortDate == 'desc') ? 'asc' : 'desc';

    if (this.sortDate == 'asc') {
      this.outEvent.emit(_.sortBy(this.data, ['created_at']));
    } else {
      this.outEvent.emit(_.reverse(_.sortBy(this.data, ['created_at'])));
    }
    // console.log('onSortDate', this);
  }
}
