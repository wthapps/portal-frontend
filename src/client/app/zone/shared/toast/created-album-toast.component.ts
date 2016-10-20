import {Component, OnChanges, AfterViewInit, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {Album} from "../../../shared/models/album.model";
import {ToastBottomBase} from "../../../shared/toast/toast-bottom/toast-bottom-base.component";

@Component({
  moduleId: module.id,
  selector: 'created-album-toast',
  templateUrl: 'created-album-toast.component.html',
  styleUrls: ['added-to-album-toast.component.css'],
})
export class ZCreatedAlbumToastComponent extends ToastBottomBase{
  @Input() showToast:boolean;
  @Output() hideToast: EventEmitter = new EventEmitter();
  @Input() album: Album;
}
