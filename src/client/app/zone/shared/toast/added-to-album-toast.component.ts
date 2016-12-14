import { Component, Input } from '@angular/core';
import { AlbumPhoto } from '../../../shared/models/album-photos.model';
import { ToastBase } from '../../../shared/toast/toast-base.component';

@Component({
  moduleId: module.id,
  selector: 'added-to-album-toast',
  templateUrl: 'added-to-album-toast.component.html',
  styleUrls: ['added-to-album-toast.component.css'],
})
export class ZAddedToAlbumToastComponent extends ToastBase {
  @Input() data: AlbumPhoto;

  constructor() {
    super('added-to-album-toast');
  }

}
