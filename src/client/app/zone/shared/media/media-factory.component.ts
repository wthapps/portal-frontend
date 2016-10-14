import {Component, Injectable} from '@angular/core';
// import { ZonePhotoComponent } from '../../picture/photo/photo.component';

@Component({
  moduleId: module.id,
  template: `<div></div>`
})

@Injectable()
export class MediaFactoryComponent {

  createMediaComponent(category: string) {
    switch (category) {
      case 'photo':
        // return new ZonePhotoComponent();
        break;
      case 'video':
        break;
    }
  }
}


