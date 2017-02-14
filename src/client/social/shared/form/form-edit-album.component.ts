import { Component, Input, Output, EventEmitter } from '@angular/core';
import {Album} from "../../../core/shared/models/album.model";
import {ToastsService} from "../../../core/partials/toast/toast-message.service";
import {AlbumService} from "../../../core/shared/services/album.service";
import {FormModalComponent} from "../../../core/shared/form/form-modal.component";
// import { AlbumService } from '../../../shared/services/picture/album.service';
// import { Album } from '../../../shared/models/album.model';
// import { ToastsService } from '../../../partials/toast/toast-message.service';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'page-zone-form-edit-album',
  templateUrl: 'form-edit-album.component.html',
})
export class ZPictureFormEditAlbumComponent extends FormModalComponent {
  @Input() album: Album;
  @Output() hideFormModal: EventEmitter<any> = new EventEmitter<any>();
  @Output() doneFormModal: EventEmitter<any> = new EventEmitter<any>();

  constructor(private albumService: AlbumService,
              private toastService: ToastsService) {
    super('form-edit-album-modal');
  }


  save() {
    let albumName = $('#album-name').val();
    let albumDes = $('#album-description').val();
    if (albumName.length == 0) {
      albumName = 'Untitled Album';
    }
    let album = new Album({name: albumName, description: albumDes});
    this.albumService.put(this.albumService.url + this.album.id, album)
      .subscribe(
        (res: any) => {
          this.toastService.success('Album is edited');
          this.album = new Album(res.data);
          this.doneFormModal.emit(this.album);
        },
        err => {
          this.toastService.danger('Failed');
        }
      );
  }
}
