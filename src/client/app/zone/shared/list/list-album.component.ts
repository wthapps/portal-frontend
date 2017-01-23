import { Component, Input, HostListener, EventEmitter, Output } from '@angular/core';

import { ZPictureListComponent } from './list.component';
import { Router } from '@angular/router';

declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'page-zone-album-listview',
  templateUrl: 'list-album.component.html'
})

export class ZAlbumListComponent extends ZPictureListComponent {
  @Input() data: any;
  @Output() imgsSelected: EventEmitter<Array<number>> = new EventEmitter<Array<number>>();
  keyCtrl: boolean = false;

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

  onDbClick(id: number) {
    this.router.navigate(['/zone/picture/album/' + id]);
  }
}
