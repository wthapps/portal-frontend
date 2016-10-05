import {Component, OnInit, Input, Output, EventEmitter, OnChanges, AfterViewInit} from '@angular/core';

import {
  ApiBaseService,
  LoadingService
} from '../../../../shared/index';
import {PhotoService} from "../../../../shared/services/photo/photo.service";
import {Album} from "../../../../shared/models/album.model";
import {FictureSharedData} from "../../../../shared/services/photo/ficturesharedata.service";

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'page-zone-form-create-album',
  templateUrl: 'form-create-album.component.html',
})
export class ZPictureFormCreateAlbumComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() showCreateAlbum:boolean;
  @Output() hideCreateAlbum: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private apiService: ApiBaseService,
              private photoService: PhotoService,
              private fictureSharedData: FictureSharedData,
              private loadingService: LoadingService) {
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    let _this = this;
    $('#form-create-album-modal').on('hidden.bs.modal', function (e:any) {
      _this.hideCreateAlbum.emit(false);
    });
  }

  ngOnChanges() {
    if (this.showCreateAlbum) {
    // if (this.showCreateAlbum) {
      $('#form-create-album-modal').modal('show');
    }
  }
  createdAlbum() {
    let albumName = $('#album-name').val();
    let albumDes = $('#album-description').val();
    if (albumName.length == 0) {
      albumName = "Untitled Album";
    }
    let album = new Album({name: albumName, description: albumDes});
    let res = this.photoService.createAlbum(album);
    if (res) {
      res.subscribe(
        (response: any) => {
          let res = JSON.parse(response._body);
          this.fictureSharedData.albumId = res.data.id;
          this.fictureSharedData.albumName = res.data.name;
          $('#form-create-album-modal').modal('hide');
        },
        error => {
          console.log(error);
        }
      );
    }
  }
}
