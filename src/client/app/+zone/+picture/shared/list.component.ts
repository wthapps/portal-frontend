import {Component, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {Photo} from '../../../shared/models/photo.model';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'page-zone-listview',
  templateUrl: 'list.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ]
})

export class ZPictureListComponent implements OnChanges {
  @Input() data: Array<Photo>;
  @Output() imgDetail: EventEmitter<number> = new EventEmitter<number>();
  dataImages: Array<Photo> = [];

  sortName: any = false;
  sortDate: any = false;

  ngOnChanges() {
    this.dataImages = this.data;
  }

  onClick(id) {
    this.imgDetail.emit(id);
  }

  /**
   *
   * @param event
   * @param column
   */
  sort(event, column) {
    if (column == 'name_photo') {
      this.sortName = (this.sortName == false || this.sortName == 'asc'  ? 'desc' : 'asc');
      console.log(this.sortName, this.dataImages);
      this.dataImages = _.orderBy(this.dataImages, [column], [this.sortName]);
      console.log('after', this.dataImages);
      this.sortDate = false;
    } else {
      this.sortDate = (this.sortDate == false || this.sortDate == 'asc' ? 'desc' : 'asc');
      this.dataImages = _.orderBy(this.dataImages, [column], [this.sortDate]);
      this.sortName = false;
    }

  }

}
