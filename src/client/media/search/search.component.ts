import { Component, OnInit, HostListener, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ServiceManager } from '../../core/shared/services/service-manager';
import { MediaViewContainerComponent } from '../shared/container/media-view-container.comoponent';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-media-search',
  templateUrl: 'search.component.html'
})
export class ZMediaSearchComponent implements OnInit {
  @ViewChild('container') container: MediaViewContainerComponent;
  firtTime: boolean = true;
  sub:any;

  constructor() {}

  ngOnInit() {
  //
  }
}
