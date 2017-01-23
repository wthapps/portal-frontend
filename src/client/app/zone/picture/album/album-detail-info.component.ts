import { Component, Output, Input, EventEmitter, OnChanges, OnInit } from '@angular/core';
import { Album } from '../../../shared/models/album.model';
import { AlbumService } from '../../../shared/services/picture/album.service';

@Component({
  moduleId: module.id,
  selector: 'zone-album-detail-info',
  templateUrl: 'album-detail-info.component.html',
  styleUrls: ['album.component.css'],
})

export class ZAlbumDetailInfoComponent implements OnInit, OnChanges {

  @Input() album: Album;
  @Output() closeInfo: EventEmitter<any> = new EventEmitter<any>();
  @Output() tagEvent: EventEmitter<Album> = new EventEmitter<Album>();
  @Output() showFormEdit: EventEmitter<any> = new EventEmitter<any>();
  albumData: Album = null;

  constructor(public albumService?: AlbumService,) {

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
