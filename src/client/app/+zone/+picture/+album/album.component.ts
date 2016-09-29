import {Component, Input, OnInit, OnChanges} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {ZPictureBarComponent} from '../shared/bar-control.component';
import {ZAlbumGridComponent} from '../shared/grid_album.component';
import {Album} from '../../../shared/models/album.model';
import {ApiBaseService, UserService, LoadingService} from '../../../shared/index';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'page-zone-album',
  templateUrl: 'album.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    ZPictureBarComponent,
    ZAlbumGridComponent
  ]
})

export class ZAlbumComponent implements OnInit {

  dataAlbums: Array<Album> = [];
  currentPage: number = 1;
  perPage: number = 1;
  total: number = 1;
  errorMessage: string = '';
  pageView: string = 'grid';

  constructor(private apiService: ApiBaseService,
              private loadingService: LoadingService) {
  }

  ngOnInit() {
    this.getAlbum(this.currentPage);
  }

  getAlbum(page:any) {
    if (this.currentPage <= Math.ceil(this.total / this.perPage)) {
      this.loadingService.start('#album-data-loading');
      this.apiService.get(`zone/albums?page=${page}`).subscribe(
        (response: any) => {
          this.perPage = response.per_page;
          this.total = response.total;
          this.dataAlbums = _.concat(this.dataAlbums, response.data);
          this.loadingService.stop('#album-data-loading');
        },
        error => {
          this.errorMessage = <any>error;
          this.loadingService.stop('#album-data-loading');
        }
      );
    }
  }

  onPageView(view: string) {
    this.pageView = view;
  }

}
