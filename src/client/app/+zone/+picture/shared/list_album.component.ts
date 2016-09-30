import {Component, Input, Output, EventEmitter, OnChanges} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {Album} from '../../../shared/models/album.model';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'page-zone-listview',
  templateUrl: 'list_album.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ]
})

export class ZAlbumListComponent implements OnChanges {
  @Input() data: Array<Album>;
  @Output() albumDetail: EventEmitter<number> = new EventEmitter<number>();
  dataAlbums: Array<Album> = [];

  sortName: any = false;
  sortDate: any = false;

  ngOnChanges() {
    this.dataAlbums = this.data;
  }

  onClick(id:any) {
    this.albumDetail.emit(id);
  }

  /**
   *
   * @param event
   * @param column
   */
  sort(event:any, column:any) {
    if (column == 'name') {
      this.sortName = (this.sortName == false || this.sortName == 'asc'  ? 'desc' : 'asc');
      console.log(this.sortName, this.dataAlbums);
      this.dataAlbums = _.orderBy(this.dataAlbums, [column], [this.sortName]);
      console.log('after', this.dataAlbums);
      this.sortDate = false;
    } else {
      this.sortDate = (this.sortDate == false || this.sortDate == 'asc' ? 'desc' : 'asc');
      this.dataAlbums = _.orderBy(this.dataAlbums, [column], [this.sortDate]);
      this.sortName = false;
    }

  }

}
