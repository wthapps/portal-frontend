import {Component, OnInit, Input, Output, EventEmitter, OnChanges, AfterViewInit} from '@angular/core';
import {FormModalComponent} from "../../../shared/form/form-modal.component";
import {AlbumService} from "../../../shared/services/picture/album.service";
import {Album} from "../../../shared/models/album.model";

@Component({
  moduleId: module.id,
  selector: 'page-zone-form-create-album',
  templateUrl: 'form-create-album.component.html',
})
export class ZPictureFormCreateAlbumComponent extends FormModalComponent{
  @Input() showFormModal:boolean;
  @Output() hideFormModal: EventEmitter= new EventEmitter();
  @Output() doneFormModal: EventEmitter<any>= new EventEmitter<any>();

  constructor(private albumService: AlbumService) {
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

  onCreatedAlbum() {
    let albumName = $('#album-name').val();
    let albumDes = $('#album-description').val();
    if (albumName.length == 0) {
      albumName = 'Untitled Album';
    }
    let album = new Album({name: albumName, description: albumDes});
    this.albumService.post(this.albumService.url, album)
      .subscribe(
        res => {
          this.doneFormModal.emit(res);
        }
      );
  }
}
