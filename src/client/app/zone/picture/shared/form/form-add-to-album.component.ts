import {Component, OnInit, Input, Output, EventEmitter, OnChanges, AfterViewInit, ElementRef} from '@angular/core';

import {Album} from '../../../../shared/models/album.model';
import {
  ApiBaseService,
  LoadingService
} from '../../../../shared/index';
import {AlbumService} from "../../../../shared/services/picture/album.service";
import {FormModalComponent} from "../../../../shared/form/form-modal.component";

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'page-zone-form-add-to-album',
  templateUrl: 'form-add-to-album.component.html',
})
export class ZPictureFormAddToAlbumComponent extends FormModalComponent{
  @Input() showForm:boolean;
  @Output() hideModal: EventEmitter= new EventEmitter();
  @Output() createNewAlbum: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {
    super('form-add-to-album-modal');
  }


  // @Input() showAddtoAlbumForm:boolean;
  // dataAlbums: Array<Album> = [];
  // currentPage: number = 1;
  // perPage: number = 1;
  // total: number = 1;
  // errorMessage = '';
  // photo_id:Array<number> = [];
  //
  // @Output() modalHide: EventEmitter<boolean> = new EventEmitter<boolean>();
  //
  // constructor(private apiService: ApiBaseService,
  //             private loadingService: LoadingService,
  //             private elementRef: ElementRef,
  //             private albumService: AlbumService) {
  // }
  // // @Output() modalHide: EventEmitter<boolean> = new EventEmitter<boolean>();
  //
  // ngOnInit() {
  //   this.getAlbum(this.currentPage);
  // }
  //
  // ngAfterViewInit() {
  //   // TODO this way is not correct in popup
  //   // let win = $('#form-add-to-album-modal');
  //   // let _this = this;
  //   // // Each time the user scrolls
  //   // win.scroll(function () {
  //   //   // End of the document reached?
  //   //   if ($(document).height() - win.height() == win.scrollTop()) {
  //   //     _this.currentPage = _this.currentPage + 1;
  //   //     _this.getAlbum(_this.currentPage);
  //   //   }
  //   // });
  //   // let _this = this;
  //   // $('#form-add-to-album-modal').on('hidden.bs.modal', function (e:any) {
  //   //   //_this.modalHide.emit(_this.album_id);
  //   //   console.log('hidden.bs.modal');
  //   //   _this.modalShowIn = false;
  //   // });
  //
  //   let _this = this;
  //   $('#form-add-to-album-modal').on('hidden.bs.modal', function (e:any) {
  //     _this.modalHide.emit(false);
  //   });
  // }
  //
  // getAlbum(page:any) {
  //   if (this.currentPage <= Math.ceil(this.total / this.perPage)) {
  //     this.loadingService.start('#album-data-loading');
  //     this.apiService.get(`zone/albums?page=${page}`).subscribe(
  //       (response: any) => {
  //         this.perPage = response.per_page;
  //         this.total = response.total;
  //         this.dataAlbums = _.concat(this.dataAlbums, response.data);
  //         this.loadingService.stop('#album-data-loading');
  //       },
  //       error => {
  //         this.errorMessage = <any>error;
  //         this.loadingService.stop('#album-data-loading');
  //       }
  //     );
  //   }
  // }
  //
  // ngOnChanges() {
  //   if (this.showAddtoAlbumForm) {
  //     $('#form-add-to-album-modal').modal('show');
  //   } else {
  //     $('#form-add-to-album-modal').modal('hide');
  //   }
  // }
  //
  // addToAlbum(album:any) {
  //   $('#form-add-to-album-modal').modal('hide');
  // }
  //
  onCreateNewAlbum() {
    this.createNewAlbum.emit(true);
  }
}
