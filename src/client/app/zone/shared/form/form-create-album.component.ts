import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormModalComponent } from '../../../shared/form/form-modal.component';
import { AlbumService } from '../../../shared/services/picture/album.service';
import { Album } from '../../../shared/models/album.model';
import { AlbumPhoto } from '../../../shared/models/album-photos.model';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'page-zone-form-create-album',
  templateUrl: 'form-create-album.component.html',
})
export class ZPictureFormCreateAlbumComponent extends FormModalComponent {
  @Output() doneFormModal: EventEmitter<any> = new EventEmitter<any>();
  @Input() items: Array<any>;
  isChanged: boolean = false;
  arrayItems: Array<number> = [];
  album: Album;


  constructor(private albumService: AlbumService) {
    super('form-create-album-modal');
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
    this.albumService.post(this.albumService.url, album)
      .subscribe(
        (res: any) => {
          this.album = new Album(res.data);
          this.doneFormModal.emit(this.album);
          if (this.arrayItems.length > 0) {
            this.albumService.post(this.albumService.url + res.data.id + '/photos', {photos: this.arrayItems})
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
