import { Component, ViewChild } from '@angular/core';
import { MediaViewContainerComponent } from '../shared/container/media-view-container.comoponent';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-media-search',
  templateUrl: 'search.component.html'
})
export class ZMediaSearchComponent {
  @ViewChild('container') container: MediaViewContainerComponent;
  sub:any;
}
