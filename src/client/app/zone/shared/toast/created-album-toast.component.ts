import { Component, Input } from '@angular/core';
import { Album } from '../../../shared/models/album.model';
import { ToastBase } from '../../../shared/toast/toast-base.component';

@Component({
  moduleId: module.id,
  selector: 'created-album-toast',
  templateUrl: 'created-album-toast.component.html',
  styleUrls: ['added-to-album-toast.component.css'],
})
export class ZCreatedAlbumToastComponent extends ToastBase {
  @Input() album: Album;

  constructor() {
    super('created-album-toast');
  }
}
