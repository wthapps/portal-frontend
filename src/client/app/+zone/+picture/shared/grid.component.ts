import {Component, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {Photo} from '../../../shared/models/photo.model';

@Component({
  moduleId: module.id,
  selector: 'page-zone-gridview',
  templateUrl: 'grid.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ]
})

export class ZPictureGridComponent implements OnChanges {
  @Input() data: Array<Photo>;
  @Output() imgDetail: EventEmitter<number> = new EventEmitter<number>();
  dataImages: Array<Photo> = [];

  ngOnChanges() {
    this.dataImages = this.data;
  }

  onClick(id) {
    this.imgDetail.emit(id);
  }
}
