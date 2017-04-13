import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { ServiceManager } from '../../core/shared/services/service-manager';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-media-search',
  templateUrl: 'search.component.html'
})
export class ZMediaSearchComponent implements OnInit {

  constructor(private serviceManager: ServiceManager) {}

  ngOnInit() {
    this.serviceManager.getActiveRoute().queryParams.subscribe(
      (queryParams: any) => {
        console.log('query params', queryParams);
      }
    );
  }
}
