import {Component, Input, OnChanges} from '@angular/core';

import {Album} from '../../../shared/models/album.model';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'page-zone-listview',
  templateUrl: 'list-album.component.html',
})

export class ZAlbumListComponent implements OnChanges {
  @Input() data: Array<Album>;
  dataAlbums: Array<Album> = [];

  sortName: any = false;
  sortDate: any = false;

  ngOnChanges() {
    this.dataAlbums = this.data;
  }

  /**
   *
   * @param event
   * @param column
   */
  // sort(event:any, column:any) {
  //   if (column == 'name') {
  //     this.sortName = (this.sortName == false || this.sortName == 'asc'  ? 'desc' : 'asc');
  //     console.log(this.sortName, this.dataAlbums);
  //     this.dataAlbums = _.orderBy(this.dataAlbums, [column], [this.sortName]);
  //     console.log('after', this.dataAlbums);
  //     this.sortDate = false;
  //   } else {
  //     this.sortDate = (this.sortDate == false || this.sortDate == 'asc' ? 'desc' : 'asc');
  //     this.dataAlbums = _.orderBy(this.dataAlbums, [column], [this.sortDate]);
  //     this.sortName = false;
  //   }
  //
  // }

}
