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
export class ZMediaSearchComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('container') container: MediaViewContainerComponent;
  firtTime: boolean = true;
  sub:any;

  constructor(private serviceManager: ServiceManager) {}

  ngOnInit() {
  //
  }

  ngAfterViewInit() {
    // this.sub = this.serviceManager.getRouter().events.subscribe((router: any) => {
    //   let paths = router.url.toString().split('/')[1].split('?');
    //   let path = paths[0];
    //   if (router.constructor.name == 'NavigationEnd' && path == 'search') {
    //     if (!this.firtTime) {
    //       this.container.list.getObjects();
    //     }
    //     this.firtTime = false;
    //   }
    // });
  }

  ngOnDestroy() {
    // this.firtTime = true;
    // this.sub.unsubscribe();
  }
}
