import { Component, Input, OnChanges, EventEmitter, Output } from '@angular/core';

import {Album} from "../../../shared/models/album.model";
import {ZPictureListComponent} from "./list.component";
import {Router} from "@angular/router";

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

  constructor(private router: Router) {
    super();
  }

  onDbClick(id: number) {
    this.router.navigate(['/zone/picture/album/' + id]);
  }
}
