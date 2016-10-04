import {Component, OnInit, Input, Output, EventEmitter, OnChanges, AfterViewInit} from '@angular/core';

import {Album} from '../../../../shared/models/album.model';
import {
  ApiBaseService,
  LoadingService
} from '../../../../shared/index';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'page-zone-form-add-to-album',
  templateUrl: 'form-add-to-album.component.html'
})
export class ZPictureFormAddToAlbumComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() modalShow: boolean;
  @Input() photoIds: Array<number>;
  dataAlbums: Array<Album> = [];
  currentPage: number = 1;
  perPage: number = 1;
  total: number = 1;
  errorMessage = '';
  album_id: number;
  photo_id: Array<number> = [];

  @Output() modalHide: EventEmitter<any> = new EventEmitter<any>();
  @Output() modalHide2: EventEmitter<any> = new EventEmitter<any>();

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
    // let _this = this;
    // $('#form-add-to-album-modal').on('hidden.bs.modal', function (e:any) {
    //   //_this.modalHide.emit(_this.album_id);
    //   console.log('hidden.bs.modal');
    //   _this.modalShowIn = false;
    // });

    let _this = this;
    $('#form-add-to-album-modal').on('hidden.bs.modal', function (e: any) {
      _this.modalShow = false;
      _this.modalHide2.emit(false);
      console.log('hidden.bs.modal, _this.modalShow:', _this.modalShow);
    });


  }

  getAlbum(page: any) {
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
    console.log('this.photo_id', this.photo_id);
    this.photo_id = this.photoIds;
    console.log('this.photo_id', this.photo_id);
    if (this.modalShow) {
      $('#form-add-to-album-modal').modal('show');
    }
  }

  addToAlbum(e: any, id: any, album: any) {
    console.log('addToAlbum:this.photo_id:', this.photo_id);
    console.log(e, id, album);
    this.modalHide.emit(album);
    $('#form-add-to-album-modal').modal('hide');

    // this.modalShowIn = false;
    //
    // this.album_id = album;
    // $('#form-add-to-album-modal').modal('hide');
    // console.log('choose ', this.album_id)
    // this.modalHide.emit(this.album_id);


  }
}
