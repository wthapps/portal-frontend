import {Component, OnChanges, AfterViewInit, Input, Output, EventEmitter} from '@angular/core';
import {Album} from "../../../shared/models/album.model";

@Component({
  moduleId: module.id,
  selector: 'added-to-album-toast',
  templateUrl: 'added-to-album-toast.component.html',
  styleUrls: ['added-to-album-toast.component.css'],
})
export class ZAddedToAlbumToastComponent implements OnChanges, AfterViewInit {
  @Input() showAddedtoAlbumToast:boolean;
  @Input() photoCount:number;
  @Input() album: Album;
  @Output() hideAddedtoAlbumToast: EventEmitter<boolean> = new EventEmitter<boolean>();

  ngOnChanges() {
    // console.log('changes');
  }

  close() {
    this.hideAddedtoAlbumToast.emit(false);
  }

  ngAfterViewInit() {
    // console.log('after innit');
  }
}
