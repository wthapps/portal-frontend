import {
  Component, OnInit, ViewChild, ViewContainerRef, AfterViewInit,
  ComponentFactoryResolver, OnDestroy
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ConfirmationService } from 'primeng/components/common/api';
import { MediaToolbarListComponent } from '../media/media-toolbar-list.component';
import { MediaListComponent } from '../media/media-list.component';
import { MediaObjectService } from './media-object.service';
import { ZMediaPhotoDetailComponent } from '../../photo/photo-detail.component';
import { ZMediaSharingComponent } from '../sharing/sharing.component';
import { ZMediaTaggingComponent } from '../tagging/tagging.component';
import { ZMediaFormAddToAlbumComponent } from '../form/form-add-to-album.component';

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
    ZMediaPhotoDetailComponent,
    ZMediaSharingComponent,
    ZMediaTaggingComponent,
    ZMediaFormAddToAlbumComponent
  ]
})
export class MediaViewContainerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('toolbarContainer', { read: ViewContainerRef }) toolbarContainer: ViewContainerRef;
  @ViewChild('listContainer', { read: ViewContainerRef }) listContainer: ViewContainerRef;
  @ViewChild('modalContainer', { read: ViewContainerRef }) modalContainer: ViewContainerRef;

  toolbarComponent: any;
  listComponent: any;
  modalComponent: any;

  toolbar: MediaToolbarListComponent;
  list: MediaListComponent;
  modal: any;

  objectType: string;
  currentPath: string; // photos, albums, share-with-me, favourite
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
      this.currentPath = router.url.toString().substr(1);
      console.log('current path', this.currentPath);

      this.route.params.subscribe(
        (params: any) => {
          console.log('params: ', params);
          if(params['id'] == undefined) {
            this.pageType = 'list'
          } else {
            this.pageType = 'detail'
          }
          this.list.data = {currentPath: this.currentPath, objectType: this.objectType, pageType: this.pageType};
          this.list.updateArgs();
          // this.toolbar.data = { mediaObject: this.mediaObject, pageType: this.pageType };
        }
      );

      this.route.queryParams.subscribe(
        (queryParams: any) => {
          console.log('query params: ', queryParams);
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

  ngOnDestroy() {
    this.list.events.unsubscribe();
  }

  loadMoreObjects() {

  }

  doAction(event: any) {
    console.log('toolbar event:', event);
    switch(event.action) {
      case 'uploadPhoto':
        this.doUpload();
          break;
      case 'share':
        this.doShare();
          break;
      case 'favourite':
        this.doFavourite();
          break;
      case 'tag':
        this.doTag();
          break;
      case 'addToAlbum':
        this.doAddToAlbum();
            break;
      // case 'viewInfo':
      //   this.doViewInfo();
      //     break;
      case 'download':
        this.doDownload();
          break;
      case 'edit':
        this.doEdit();
          break;
      case 'delete':
        this.doDelete();
          break;

      case 'changeView':
        this.list.changeView(event.params.viewOption);
          break;
      case 'preview':
      case 'previewAll':
      case 'viewInfo':
        this.doPreview();
          break;
      case 'select':
      case 'deselect':
        this.selectedObjects = event.params.selectedObjects;
        this.toolbar.updateAttributes({selectedObjects: this.selectedObjects});
          break;
    }
  }

  doUpload() {
    // this.loadModalComponent(MediaUloaderComponent);

  }

  doPreview() {
    // open modal
    this.loadModalComponent(ZMediaPhotoDetailComponent);
    this.modal.open({viewInfo: false, show: true, selectedObjects: this.selectedObjects});
    // this.modal.events.subscribe((event: any) => {
    //   this.doAction(event);
    // });
  }

  doShare() {
    this.loadModalComponent(ZMediaSharingComponent);
    this.modal.open();
  }

  doFavourite() {

  }

  doTag() {
    this.loadModalComponent(ZMediaTaggingComponent);
    this.modal.open();
  }

  doAddToAlbum() {
    this.loadModalComponent(ZMediaFormAddToAlbumComponent);
    this.modal.open();
  }

  doViewInfo() {
    this.modal.open({viewInfo: true});
  }

  doDownload() {

  }

  doEdit() {

  }

  doDelete() {
    let objIds = _.map(this.selectedObjects, 'id'); // ['1','2'];
    this.confirmationService.confirm({
      message: 'Are you sure to delete ' + this.selectedObjects.length + ' item' + (this.selectedObjects.length > 1 ? 's' : '') + ' ?',
      accept: () => {
        let body = JSON.stringify({ids: objIds});
        // this.loadingService.start();
        // this.photoService.deletePhoto(body).subscribe((response: any)=> {
        //   _.map(idPhotos, (id: any)=> {
        //     _.remove(this.data, ['id', id]);
        //   });
        //   this.loadingService.stop();
        // });
      }
    });
  }

  private loadModalComponent(component: any) {
    let modalComponentFactory = this.resolver.resolveComponentFactory(component);
    this.modalContainer.clear();
    this.modalComponent = this.modalContainer.createComponent(modalComponentFactory);
    this.modal = this.modalComponent.instance;
  }
}
