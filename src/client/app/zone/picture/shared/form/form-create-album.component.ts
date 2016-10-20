import {Component, OnInit, Input, Output, EventEmitter, OnChanges, AfterViewInit} from '@angular/core';

import {
  ApiBaseService,
  LoadingService
} from '../../../../shared/index';
import {PhotoService} from '../../../../shared/services/picture/photo.service';
import {Album} from '../../../../shared/models/album.model';
import {AlbumService} from "../../../../shared/services/picture/album.service";
import {FormModalComponent} from "../../../../shared/form/form-modal.component";

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'page-zone-form-create-album',
  templateUrl: 'form-create-album.component.html',
})
export class ZPictureFormCreateAlbumComponent extends FormModalComponent{
  @Input() showForm:boolean;
  @Output() hideModal: EventEmitter= new EventEmitter();

  constructor() {
    super('form-create-album-modal');
  }


  // @Input() showCreateAlbumForm:boolean;
  // @Output() hideCreateAlbum: EventEmitter<boolean> = new EventEmitter<boolean>();

  // constructor(private apiService: ApiBaseService,
  //             private photoService: PhotoService,
  //             private albumService: AlbumService,
  //             private loadingService: LoadingService) {
  // }
  //
  // createdAlbum() {
  //   // let albumName = $('#album-name').val();
  //   // let albumDes = $('#album-description').val();
  //   // if (albumName.length == 0) {
  //   //   albumName = 'Untitled Album';
  //   // }
  //   // let album = new Album({name: albumName, description: albumDes});
  //   // this.albumService.createAlbum(album, (response:any) => {
  //   //   this.albumService.setAlbum(new Album(response.data));
  //   //   $('#form-create-album-modal').modal('hide');
  //   // });
  // }
}
