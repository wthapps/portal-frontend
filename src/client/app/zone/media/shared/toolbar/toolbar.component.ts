import { Component, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { ZMediaFormAddToAlbumComponent } from '../form/form-add-to-album.component';
import { ZMediaFormEditAlbumComponent } from '../form/form-edit-album.component';
import { Constants } from '../../../../shared/index';


@Component({
  moduleId: module.id,
  selector: 'z-media-share-toolbar',
  templateUrl: 'toolbar.component.html'
})

export class ZMediaToolbarComponent {
  @ViewChild('formAddAlbum') formAddAlbum: ZMediaFormAddToAlbumComponent;
  @ViewChild('formEditAlbum') formEditAlbum: ZMediaFormEditAlbumComponent;


  @Input() type: string = '';
  @Input() selectedPhotos: any;
  @Input() hasFavourite: any;
  @Input() currentView: any;
  @Output() outEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() outEventUploading: EventEmitter<any> = new EventEmitter<any>();


  selectedEl: any;
  items = Constants.pictureMenuItems;

  constructor(private router: Router) {
    // Don't move it to onInit, it's not correct
    this.selectedEl = {name: 'Photos', css: 'fa fa-picture-o', link: '/zone/media/photo'};
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
}
