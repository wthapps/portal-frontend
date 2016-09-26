import {Component} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {ZPictureBarComponent} from '../shared/bar-control.component';

@Component({
  moduleId: module.id,
  selector: 'page-zone-video',
  templateUrl: 'video.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    ZPictureBarComponent
  ]
})

export class ZVideoComponent {
}
