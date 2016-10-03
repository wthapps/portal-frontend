import {Component, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {Album} from '../../../../../shared/models/album.model';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'page-zone-listview',
  templateUrl: 'list-album.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ]
})

export class ZFormAlbumListComponent implements OnChanges {
  @Input() data: Array<Album>;
  @Output() addedToAlbumEvent: EventEmitter<number> = new EventEmitter<number>();

  dataAlbums: Array<Album> = [];

  ngOnChanges() {
    this.dataAlbums = this.data;
  }

  addToAlbum(album_id:any) {
    this.addedToAlbumEvent.emit(album_id);
  }

}
