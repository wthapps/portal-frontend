import {Component, OnInit, Input, Output, EventEmitter, OnChanges, AfterViewInit} from '@angular/core';

import {ZFormAlbumListComponent} from './form_component/list-album.component'
import {Album} from '../../../../shared/models/album.model'
import {
  ApiBaseService,
  LoadingService
} from '../../../../shared/index';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'page-zone-form-add-to-album',
  templateUrl: 'form-add-to-album.component.html',
  directives: [
    ZFormAlbumListComponent,
  ]
})
export class ZPictureFormAddToAlbumComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() modalShow:any;
  dataAlbums: Array<Album> = [];
  currentPage: number = 1;
  perPage: number = 1;
  total: number = 1;
  errorMessage = '';
  @Output() addedToAlbumEvent: EventEmitter<number> = new EventEmitter<number>();

  constructor(private apiService: ApiBaseService,
              private loadingService: LoadingService) {
  }
  // @Output() modalHide: EventEmitter<boolean> = new EventEmitter<boolean>();

  ngOnInit() {
    this.getAlbum(this.currentPage);
  }

  ngAfterViewInit() {
    // TODO this way is not correct in popup
    // let win = $('#form-add-to-album-modal');
    // let _this = this;
    // // Each time the user scrolls
    // win.scroll(function () {
    //   // End of the document reached?
    //   if ($(document).height() - win.height() == win.scrollTop()) {
    //     _this.currentPage = _this.currentPage + 1;
    //     _this.getAlbum(_this.currentPage);
    //   }
    // });
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

  ngOnChanges() {
    if (this.modalShow) {
      $('#form-add-to-album-modal').modal('show');
    }
  }

  addedToAlbum($event:any) {
    // console.log($event);
    this.addedToAlbumEvent.emit($event);
  }
}
