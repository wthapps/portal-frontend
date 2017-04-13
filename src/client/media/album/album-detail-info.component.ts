import { Component, Output, Input, EventEmitter, OnChanges, OnInit } from '@angular/core';
import { Album } from '../shared/model/album.model';

@Component({
  moduleId: module.id,
  selector: 'album-detail-info',
  templateUrl: 'album-detail-info.component.html',
  styleUrls: ['album-detail-info.component.css'],
})

export class AlbumDetailInfoComponent implements OnInit, OnChanges {

  @Input() album: Album;
  @Output() closeInfo: EventEmitter<any> = new EventEmitter<any>();
  @Output() tagEvent: EventEmitter<Album> = new EventEmitter<Album>();
  @Output() showFormEdit: EventEmitter<any> = new EventEmitter<any>();

  albumData: Album = null;

  constructor() {

  }

  onClose() {
    this.closeInfo.emit();
  }

  ngOnInit() {

  }

  ngOnChanges() {
    // if(this.album.id != null) {
    //   this.renderForm();
    // }
  }

  onShowEditInfo() {
    this.showFormEdit.emit();
  }

  tag(album: Album) {
    this.tagEvent.emit(album);
  }
}
