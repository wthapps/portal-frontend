import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormModalComponent } from '../../../core/shared/form/form-modal.component';
import { Album } from '../model/album.model';
import { AlbumPhoto } from '../model/album-photos.model';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';
import { ModalComponent } from 'ng2-bs3-modal/components/modal';
// import { FormModalComponent } from '../../../shared/form/form-modal.component';
// import { AlbumService } from '../../../shared/services/picture/album.service';
// import { Album } from '../../../shared/models/album.model';
// import { AlbumPhoto } from '../../../shared/models/album-photos.model';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'album-create',
  templateUrl: 'album-create.component.html',
})
export class AlbumCreateComponent extends FormModalComponent {
  @Output() doneFormModal: EventEmitter<any> = new EventEmitter<any>();
  @Input() items: Array<any>;


  @ViewChild('modal') modal: ModalComponent;


  isChanged: boolean = false;
  arrayItems: Array<number> = [];
  album: Album;

  // TODO delete below url
  private url = 'media/albums/';

  constructor(private api: ApiBaseService) {
    super('form-create-album-modal');
  }

  open() {
    this.modal.open();
  }
  onCreatedAlbum() {
    if (!this.isChanged) {
      this.arrayItems = [];
      _.map(this.items, (v: any) => {
        this.arrayItems.push(v.id);
      });
    }
    this.createAlbum();
  }

  createAlbum() {
    let albumName = $('#album-name').val();
    let albumDes = $('#album-description').val();
    if (albumName.length == 0) {
      albumName = 'Untitled Album';
    }
    let album = new Album({name: albumName, description: albumDes});
    this.api.post(this.url, album)
      .subscribe(
        (res: any) => {
          this.album = new Album(res.data);
          this.doneFormModal.emit(this.album);
          if (this.arrayItems.length > 0) {
            this.api.post(this.url + res.data.id + '/photos', {photos: this.arrayItems})
              .subscribe(
                (res: any) => {
                  let albumPhotos = new AlbumPhoto({album: this.album, photos: this.arrayItems});
                  this.doneFormModal.emit(albumPhotos);
                }
              );
          }
        }
      );
  }

  onAddItems(arrayItems: Array<number>) {
    this.isChanged = true;
    this.arrayItems = arrayItems;
  }
}
