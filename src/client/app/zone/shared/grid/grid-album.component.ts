import {Component, Input, Output, EventEmitter, OnChanges} from '@angular/core';

import {Album} from '../../../shared/models/album.model';
import {ZPictureGridComponent} from "./grid.component";

@Component({
  moduleId: module.id,
  selector: 'page-zone-album-gridview',
  templateUrl: 'grid-album.component.html',
  host: {
    '(document:keydown)': 'onDocumentKeyDown($event)',
    '(document:keyup)': 'onDocumentKeyUp($event)'
  }
})

export class ZAlbumGridComponent extends ZPictureGridComponent{
  @Input() data: Array<Album>;
  @Output() imgsSelected: EventEmitter<Array<number>> = new EventEmitter<Array<number>>();
}
