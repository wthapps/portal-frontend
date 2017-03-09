import { Component, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { Constants } from '../../../core/shared/config/constants';

import { ZMediaFormAddToAlbumComponent } from '../form/form-add-to-album.component';
import { ZMediaFormEditAlbumComponent } from '../form/form-edit-album.component';
import { ZMediaSharingComponent } from '../sharing/sharing.component';
import { ZMediaTaggingComponent } from '../tagging/tagging.component';


@Component({
  moduleId: module.id,
  selector: 'z-media-share-toolbar',
  templateUrl: 'toolbar.component.html'
})

export class ZMediaToolbarComponent {
  @ViewChild('formAddAlbum') formAddAlbum: ZMediaFormAddToAlbumComponent;
  @ViewChild('formEditAlbum') formEditAlbum: ZMediaFormEditAlbumComponent;
  @ViewChild('zoneSharing') zoneSharing: ZMediaSharingComponent;
  @ViewChild('zoneTagging') zoneTagging: ZMediaTaggingComponent;


  @Input() type: string = '';

  @Input() albumDetail: any = null;

  @Input() selectedPhotos: any;
  @Input() hasFavourite: any;
  @Input() currentView: any;
  @Output() outEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() outEventUploading: EventEmitter<any> = new EventEmitter<any>();


  selectedEl: any;
  readonly items = Constants.pictureMenuItems;
  readonly urls = Constants.urls;

  constructor(private router: Router, private location: Location) {
    // Don't move it to onInit, it's not correct
    this.selectedEl = {name: 'Photos', css: 'fa fa-picture-o', link: `/${this.urls.photo}`};
    this.router.events.subscribe((navigation: any) => {
      for (var item of this.items) {
        if (item.link == navigation.url) {
          this.selectedEl = item;
        }
      }
    });
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
        this.zoneTagging.modal.open();
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
