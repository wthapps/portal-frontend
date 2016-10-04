import {Component, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {Album} from '../../../shared/models/album.model';

@Component({
  moduleId: module.id,
  selector: 'page-zone-gridview',
  templateUrl: 'grid_album.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ]
})

export class ZAlbumGridComponent implements OnChanges {
  @Input() data: Array<Album>;
  @Output() albumDetail: EventEmitter<number> = new EventEmitter<number>();
  dataAlbums: Array<Album> = [];

  ngOnChanges() {
    this.dataAlbums = this.data;
  }

  onClick(id:any) {
    this.albumDetail.emit(id);
  }
}
