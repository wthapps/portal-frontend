import {
  Component, OnInit, ViewChild, ViewContainerRef, AfterViewInit,
  ComponentFactoryResolver
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ConfirmationService } from 'primeng/components/common/api';
import { MediaToolbarListComponent } from '../media/media-toolbar-list.component';
import { MediaListComponent } from '../media/media-list.component';
import { MediaObjectService } from './media-object.service';
import { ZMediaPhotoDetailComponent } from '../../photo/photo-detail.component';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'me-view-container',
  templateUrl: 'media-view-container.component.html',
  providers: [MediaObjectService],
  entryComponents: [
    MediaToolbarListComponent,
    MediaListComponent,
    ZMediaPhotoDetailComponent
  ]
})
export class MediaViewContainerComponent implements OnInit, AfterViewInit {
  @ViewChild('toolbarContainer', { read: ViewContainerRef }) toolbarContainer: ViewContainerRef;
  @ViewChild('listContainer', { read: ViewContainerRef }) listContainer: ViewContainerRef;
  @ViewChild('modalContainer', { read: ViewContainerRef }) modalContainer: ViewContainerRef;

  toolbarComponent: any;
  listComponent: any;
  modalComponent: any;

  toolbar: MediaToolbarListComponent;
  list: MediaListComponent;
  modal: any;

  mediaObject: string;
  pageType: string = 'list';
  selectedObjects: Array<any>;
  objects: Array<any>;

  viewOption: string = 'grid';

  constructor(
    private resolver: ComponentFactoryResolver,
    private router: Router,
    private route: ActivatedRoute,
    private mediaObjectService: MediaObjectService,
    private confirmationService: ConfirmationService) {

  }

  ngOnInit() {

    this.selectedObjects = new Array<any>();

    this.router.events.subscribe((router: any) => {
      this.mediaObject = router.url.toString().substr(1);

      this.route.params.subscribe(
        (params: any) => {
          if(params['id'] == undefined) {
            this.pageType = 'list'
          } else {
            this.pageType = 'detail'
          }
          // this.toolbar.data = { mediaObject: this.mediaObject, pageType: this.pageType };
        }
      );
    });
  }

  ngAfterViewInit(): void {
    let tbComponentFactory = this.resolver.resolveComponentFactory(MediaToolbarListComponent);
    this.toolbarContainer.clear();
    this.toolbarComponent = this.toolbarContainer.createComponent(tbComponentFactory);
    this.toolbar = <MediaToolbarListComponent>this.toolbarComponent.instance;

    this.toolbar.events.subscribe((event: any) => {
      this.doAction(event);
    });

    let listComponentFactory = this.resolver.resolveComponentFactory(MediaListComponent);
    this.listContainer.clear();
    this.listComponent = this.listContainer.createComponent(listComponentFactory);
    this.list = <MediaListComponent>this.listComponent.instance;
    this.list.selectedObjects = this.selectedObjects;

    this.list.events.subscribe((event: any) => {
      this.doAction(event);
    });

  }

  doAction(event: any) {
    console.log('toolbar event:', event);
    switch(event.action) {
      case 'changeView':
        this.list.changeView(event.params.viewOption);
        break;
      case 'preview':
      case 'previewAll':
        this.doPreview();
        break;
      case 'select':
      case 'deselect':
        this.selectedObjects = event.params.selectedObjects;
        this.toolbar.updateAttributes({selectedObjects: this.selectedObjects});
        break;
    }
  }

  doPreview() {
    // open modal
    let localComponent = ZMediaPhotoDetailComponent;

    let modalComponentFactory = this.resolver.resolveComponentFactory(localComponent);
    this.modalContainer.clear();
    this.modalComponent = this.modalContainer.createComponent(modalComponentFactory);
    this.modal = <MediaToolbarListComponent>this.modalComponent.instance;

    this.modal.preview(true);
    // this.modal.events.subscribe((event: any) => {
    //   this.doAction(event);
    // });
  }
}
