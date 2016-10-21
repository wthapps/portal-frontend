import {Component, OnChanges, AfterViewInit, Input, Output, EventEmitter} from '@angular/core';
import {Album} from "../../../shared/models/album.model";
import {FormModalComponent} from "../../../shared/form/form-modal.component";
import {ToastBottomBase} from "../../../shared/toast/toast-bottom/toast-bottom-base.component";
import {AlbumPhoto} from "../../../shared/models/album-photos.model";

@Component({
  moduleId: module.id,
  selector: 'added-to-album-toast',
  templateUrl: 'added-to-album-toast.component.html',
  styleUrls: ['added-to-album-toast.component.css'],
})
export class ZAddedToAlbumToastComponent extends ToastBottomBase{
  @Input() showToast:boolean;
  @Input() data:AlbumPhoto;
  @Output() hideToast: EventEmitter<boolean> = new EventEmitter<boolean>();

}
