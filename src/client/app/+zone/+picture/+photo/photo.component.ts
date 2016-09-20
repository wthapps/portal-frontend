import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {ZPhotoDetailComponent} from './photo-detail.component'


@Component({
  moduleId: module.id,
  selector: 'page-zone-photo',
  templateUrl: 'photo.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    ZPhotoDetailComponent
  ]
})

export class ZPhotoComponent {

}
