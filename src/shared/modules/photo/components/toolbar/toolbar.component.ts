import { Component, Input, EventEmitter, Output, ViewChild, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { ZMediaToolbarPhotoComponent } from './photo/photo.component';
import { ZMediaToolbarAlbumComponent } from './album/album.component';
import { Constants } from '@shared/constant';
import { SharingModalComponent } from '../modal/sharing/sharing-modal.component';
import { TaggingModalComponent } from '../modal/tagging/tagging-modal.component';

@Component({
  selector: 'z-media-share-toolbar',
  templateUrl: 'toolbar.component.html'
})

export class ZMediaToolbarComponent implements OnInit {
  @ViewChild('formAddAlbum') formAddAlbum: any;
  @ViewChild('formEditAlbum') formEditAlbum: any;
  @ViewChild('formEditName') formEditName: any;
  @ViewChild('zoneSharing') zoneSharing: SharingModalComponent;
  @ViewChild('zoneTagging') zoneTagging: TaggingModalComponent;
  @ViewChild('toolbarPhoto') toolbarPhoto: ZMediaToolbarPhotoComponent;
  @ViewChild('toolbarAlbum') toolbarAlbum: ZMediaToolbarAlbumComponent;


  @Input() albumDetail: any = null;
  @Input() type: any;

  @Input() selectedPhotos: any;
  @Input() selectedAlbums: any;
  @Input() hasFavourite: any;
  @Input() currentView: any;
  @Input() photos: any;
  @Input() albums: any;
  @Output() outEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() outEventUploading: EventEmitter<any> = new EventEmitter<any>();


  selectedEl: any;
  readonly items = Constants.pictureMenuItems;
  readonly urls = Constants.urls;

  constructor(private router: Router, private location: Location) {
    // Don't move it to onInit, it's not correct
    this.selectedEl = { name: 'Photos', css: 'fa fa-picture-o', link: `/${this.urls.photo}` };
    this.router.events.subscribe((navigation: any) => {
      for (var item of this.items) {
        if (item.link == navigation.url) {
          this.selectedEl = item;
        }
      }
    });
  }

  ngOnInit() {
    // this.localStorageService.get
  }

  onAction(action: string) {
    switch (action) {
      case 'addToAlbum':
        this.formAddAlbum.getAlbum();
        this.formAddAlbum.modal.open();
        break;
      case 'share':
        this.zoneSharing.modal.open();
        this.zoneSharing.getShared();
        break;

      case 'tag':
        if (this.type == 'photo') {
          this.zoneTagging.selectedItems = this.selectedPhotos;
          this.zoneTagging.items = this.photos;
        } else {
          this.zoneTagging.selectedItems = this.selectedAlbums;
          this.zoneTagging.items = this.albums;
        }
        this.zoneTagging.mediaType = this.type;
        this.zoneTagging.open();
        break;
      default:
        this.outEvent.emit(action);
        break;
    }

    return false;
  }

  onActionUploading(event: any) {
    switch (event.action) {
      case 'addToAlbum':
        this.formAddAlbum.selectedPhotos = event.data;
        this.formAddAlbum.getAlbum();
        this.formAddAlbum.modal.open();
        break;
      case 'createAlbum':
        this.formEditAlbum.selectedPhotos = event.data;
        this.formEditAlbum.modal.open();
        break;
      case 'addPhoto':
        this.selectedPhotos.length = 0;
        this.outEventUploading.emit(event);
        break;
      default:
        break;
    }
  }

  onBack() {
    this.location.back();
  }
}
