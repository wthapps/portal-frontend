import {Component, Input, Output, EventEmitter, OnChanges} from '@angular/core';

import {Album} from '../../../shared/models/album.model';

@Component({
  moduleId: module.id,
  selector: 'page-zone-album-gridview',
  templateUrl: 'grid-album.component.html',
})

export class ZAlbumGridComponent implements OnChanges {
  @Input() data: Array<Album>;
  @Output() albumDetail: EventEmitter<number> = new EventEmitter<number>();
  dataAlbums: Array<Album> = [];

  ngOnChanges() {
    this.dataAlbums = this.data;
  }

  onClick(album:any) {
    this.albumDetail.emit(album.id);
    console.log(album);
  }
}
