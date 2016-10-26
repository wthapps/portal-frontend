import { Component, OnChanges, AfterViewInit, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Album } from "../../../shared/models/album.model";
import { ToastBase } from "../../../shared/toast/toast-base.component";
import { FormManagerService } from "../../../shared/form/form-manager.service";

@Component({
  moduleId: module.id,
  selector: 'created-album-toast',
  templateUrl: 'created-album-toast.component.html',
  styleUrls: ['added-to-album-toast.component.css'],
})
export class ZCreatedAlbumToastComponent extends ToastBase {
  @Input() album: Album;

  constructor(private formManagerService: FormManagerService,) {
    super('created-album-toast');
  }
}
