import {Component, OnInit, Input, Output, EventEmitter, OnChanges, AfterViewInit} from '@angular/core';

import {
  ApiBaseService,
  LoadingService
} from '../../../../shared/index';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'page-zone-form-create-album',
  templateUrl: 'form-create-album.component.html',
})
export class ZPictureFormCreateAlbumComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() showCreateAlbum:boolean;

  constructor(private apiService: ApiBaseService,
              private loadingService: LoadingService) {
  }

  ngOnInit() {
    // this.getAlbum(this.currentPage);
  }

  ngAfterViewInit() {
    // let _this = this;
    // $('#form-add-to-album-modal').on('hidden.bs.modal', function (e:any) {
    //   _this.modalHide.emit(_this.albumId);
    // });
  }

  ngOnChanges() {
    if (0) {
    // if (this.showCreateAlbum) {
      $('#form-create-album-modal').modal('show');
    }
  }
}
