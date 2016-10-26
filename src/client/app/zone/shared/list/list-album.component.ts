import { Component, Input, OnChanges, EventEmitter, Output } from '@angular/core';

import { Album } from "../../../shared/models/album.model";
import { ZPictureListComponent } from "./list.component";

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'page-zone-album-listview',
  templateUrl: 'list-album.component.html',
  host: {
    '(document:keydown)': 'onDocumentKeyDown($event)',
    '(document:keyup)': 'onDocumentKeyUp($event)'
  }
})

export class ZAlbumListComponent extends ZPictureListComponent {
  @Input() data: Array<Album>;
  @Output() imgsSelected: EventEmitter<Array<number>> = new EventEmitter<Array<number>>();

}
