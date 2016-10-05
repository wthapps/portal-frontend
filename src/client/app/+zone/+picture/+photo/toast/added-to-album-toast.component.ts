import {Component, OnChanges, AfterViewInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'added-to-album-toast',
  templateUrl: 'added-to-album-toast.component.html',
  styleUrls: ['added-to-album-toast.component.css'],
  directives: [
  ]
})
export class AddedToAlbumToast implements OnChanges, AfterViewInit{
  @Input() showAddedtoAlbumToast:boolean;
  @Input() photoCount:number;
  @Output() hideAddedtoAlbumToast: EventEmitter<boolean> = new EventEmitter<boolean>();

  ngOnChanges() {
  }

  close() {
    this.hideAddedtoAlbumToast.emit(false);
  }

  ngAfterViewInit() {

  }
}
