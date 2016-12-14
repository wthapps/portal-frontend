import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';

import { ZPictureGridComponent } from './grid.component';
import { Router } from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'page-zone-album-gridview',
  templateUrl: 'grid-album.component.html'
})

export class ZAlbumGridComponent extends ZPictureGridComponent {
  @Input() data: any;
  @Output() imgsSelected: EventEmitter<Array<number>> = new EventEmitter<Array<number>>();
  @Output() addFavouriteEvent: EventEmitter<any> = new EventEmitter<any>();
  keyCtrl: boolean = false;
  reset: boolean;
  selectedPhotos: any = [];

  @HostListener('document:keydown', ['$event'])
  onKeyDown(ev: KeyboardEvent) {
    if (ev.keyCode == 17 || ev.keyCode == 18 || ev.keyCode == 91 || ev.keyCode == 93 || ev.ctrlKey) {
      this.keyCtrl = true;
    }
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(ev: KeyboardEvent) {
    if (ev.keyCode == 17 || ev.keyCode == 18 || ev.keyCode == 91 || ev.keyCode == 93 || ev.ctrlKey) {
      this.keyCtrl = false;
    }
  }

  constructor(private router: Router) {
    super();
  }

  onDbClick(e: any, id: number) {
    this.router.navigate(['/zone/picture/album/' + id]);
  }

  addFavourite(e: any, item: any) {
    this.addFavouriteEvent.emit(item);
  }
}
