import {
  Component, OnInit, ViewChild, ViewContainerRef, AfterViewInit,
  ComponentFactoryResolver, OnDestroy, Input
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ConfirmationService } from 'primeng/components/common/api';
import { MediaToolbarListComponent } from '../media/media-toolbar-list.component';
import { MediaListComponent } from '../media/media-list.component';
import { MediaObjectService } from './media-object.service';
import { ZMediaPhotoDetailComponent } from '../../photo/photo-detail.component';
import { SharingModalComponent } from '../modal/sharing/sharing-modal.component';
import { TaggingModalComponent } from '../modal/tagging/tagging-modal.component';
import { AddToAlbumModalComponent } from '../modal/add-to-album-modal.component';
import { AlbumEditModalComponent } from '../modal/album-edit-modal.component';
import { AlbumCreateModalComponent } from '../modal/album-create-modal.component';
import { PhotoEditModalComponent } from '../../photo/form/photo-edit-modal.component';
import { BaseObjectEditNameModalComponent } from '../modal/base-object-edit-name-modal.component';
import { AlbumDetailInfoComponent } from '../../album/album-detail-info.component';
import { PhotoDetailModalComponent } from '../modal/photo-detail-modal.component';

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

    SharingModalComponent,
    TaggingModalComponent,

    BaseObjectEditNameModalComponent,

    AlbumCreateModalComponent,
    AlbumEditModalComponent,
    AlbumDetailInfoComponent,

    PhotoDetailModalComponent,
    PhotoEditModalComponent,
    AddToAlbumModalComponent
  ]
})
export class MediaViewContainerComponent implements OnInit, AfterViewInit, OnDestroy {
  /*
   * Value of objectType:
   * media: is base object
   * photo
   * album
   * video
   * playlist
   * */
  @Input() objectType: string = 'media';

  /*
   * pageType value:
   * list
   * detail
   *
   * */
  @Input() pageType: string = 'list';
  @Input() params: any;

  @ViewChild('toolbarContainer', { read: ViewContainerRef }) toolbarContainer: ViewContainerRef;
  @ViewChild('listContainer', { read: ViewContainerRef }) listContainer: ViewContainerRef;
  @ViewChild('infoContainer', { read: ViewContainerRef }) infoContainer: ViewContainerRef;
  @ViewChild('modalContainer', { read: ViewContainerRef }) modalContainer: ViewContainerRef;


  toolbarComponent: any;
  listComponent: any;
  detailInfoComponent: any;
  modalComponent: any;

  toolbar: MediaToolbarListComponent;
  list: MediaListComponent;
  detailInfo: any;
  modal: any;

  currentPath: string; // photos, albums, share-with-me, favourite
  selectedObjects: Array<any> = [];
  objects: Array<any>;

  viewOption: string = 'grid';
  private currentPage: string;
  private showDetailInfo: boolean = true;

  // you are also able to inject PhotoService and AlbumService here for calling existing functions quickly
  constructor(
    private resolver: ComponentFactoryResolver,
    private router: Router,
    private route: ActivatedRoute,
    private mediaObjectService: MediaObjectService,
    private confirmationService: ConfirmationService) {

  }

  ngOnInit() {
    // this.currentPath = `${this.objectType}s`;
    this.currentPath = this.router.url.toString().split('/')[1].split('?')[0]; // currentPath: photos, albums, shared-with-me
    this.currentPage = `${this.objectType}_${this.pageType}`;
  }

  ngAfterViewInit(): void {
    this.createToolbarComponent();

    // Init data
    this.toolbar.initProperties({
      currentPage: this.currentPage,
      currentPath: this.currentPath,
      objectType: this.objectType,
      pageType: this.pageType
    });

    // subscribe event
    this.toolbar.events.subscribe((event: any) => {
      this.doAction(event);
    });

    this.createListComponent();

    this.list.initProperties({
      currentPage: this.currentPage,
      currentPath: this.currentPath,
      objectType: this.objectType,
      pageType: this.pageType,
      params: this.params
    });

    this.list.events.subscribe((event: any) => {
      this.doAction(event);
    });

    this.createDetailInfoComponent();
    this.detailInfo.event.subscribe((event: any) => {
      this.doAction(event);
    });

  }

  createToolbarComponent() {
    let tbComponentFactory = this.resolver.resolveComponentFactory(MediaToolbarListComponent);
    this.toolbarContainer.clear();
    this.toolbarComponent = this.toolbarContainer.createComponent(tbComponentFactory);
    this.toolbar = <MediaToolbarListComponent>this.toolbarComponent.instance;
  }

  createListComponent() {
    let listComponentFactory = this.resolver.resolveComponentFactory(MediaListComponent);
    this.listContainer.clear();
    this.listComponent = this.listContainer.createComponent(listComponentFactory);
    this.list = <MediaListComponent>this.listComponent.instance;
    this.list.selectedObjects = this.selectedObjects;
  }

  createDetailInfoComponent() {
    let detailInfoComponentFactory = this.resolver.resolveComponentFactory(AlbumDetailInfoComponent);
    this.infoContainer.clear();
    this.detailInfoComponent = this.infoContainer.createComponent(detailInfoComponentFactory);
    this.detailInfo = <AlbumDetailInfoComponent>this.detailInfoComponent.instance;
    this.detailInfo.selectedObjects = this.selectedObjects;
  }

  ngOnDestroy() {
    this.list.events.unsubscribe();
  }

  // considering moving doAction into list-media
  doAction(event: any) {
    switch(event.action) {
      case 'select':
      case 'deselect':
        this.selectedObjects = event.params.selectedObjects;
        this.toolbar.updateAttributes({selectedObjects: this.selectedObjects});
        break;
      case 'goBack':
        this.goBack();
        break;
      case 'toggleDetailInfo':
        this.showDetailInfo = !this.showDetailInfo;
        break;

      // Handle modal events
      case 'openModal':
        this.openModal(event.params);
          break;
      // Handle modal events
      case 'closeModal':
        this.closeModal()
        break;

      default:
        this.list.doAction(event);
          break;
    }
  }

  upload() {
    // this.loadModalComponent(MediaUloaderComponent);

  }

  showUploadedPhoto(photo: any) {
    console.debug('Photo uploaded: ', photo);

    // TODO: Handle album details
    if( this.currentPath == 'photos') {
      // Add objects to media list
      this.list.objects.unshift(photo);
    }
  }

  showNewAlbum(album: any) {
    console.debug('New album: ', album);

    if( this.currentPath == 'albums') {
      // Add objects to media list
      this.list.objects.unshift(album);
    }
    // TODO: Show toast
  }



  share() {
    this.loadModalComponent(SharingModalComponent);
    this.modal.open({selectedItems: this.selectedObjects});
  }

  favourite() {

  }

  tag() {
    this.loadModalComponent(TaggingModalComponent);
    this.modal.open();
  }

  addToAlbum(photos?: any) {
    this.loadModalComponent(AddToAlbumModalComponent);
    let objects = (photos != undefined) ? photos : this.selectedObjects;
    this.modal.open({selectedObjects: objects});
  }

  viewInfo() {
    this.loadModalComponent(ZMediaPhotoDetailComponent);
    this.modal.open({show: true, showDetails: true, selectedObjects: this.selectedObjects});
  }

  download() {

  }

  edit() {
    if(this.currentPath == 'photos') {

    } else if(this.currentPath == 'albums') {
      this.loadModalComponent(AlbumEditModalComponent);
      this.modal.open({selectedObjects: this.selectedObjects});
    }

  }

  editName(selectedObject: any) {
    console.log('call edit name method here:');
    // this.loadModalComponent(BaseObjectEditNameModalComponent);
    // this.modal.open();
  }

  editInfo(selectedObject: any) {
    if(this.currentPath == 'photos') {
      this.loadModalComponent(PhotoEditModalComponent);
      this.modal.open({selectedObjects: this.selectedObjects});
    } else if(this.currentPath == 'albums') {
      // this.loadModalComponent(ZMediaFormEditAlbumComponent);
      // this.modal.open();
    }

  }


  // TODO: Go back using previous path
  goBack() {
    switch (this.objectType) {
      case 'photo':
      case 'album':
        this.router.navigate([`/${this.objectType}s`]);
        break;
    }
  }

  openModal(params: any) {
    let options: any;
    console.log('open modal: ', params.modalName);
    switch (params.modalName) {
      case 'editNameModal':
        this.loadModalComponent(BaseObjectEditNameModalComponent);
        options = {selectedObjects: this.selectedObjects};
        break;
      case 'editInfoModal':
        switch (this.objectType) {
          case 'photo':
            this.loadModalComponent(PhotoEditModalComponent);
            break;
          case 'album':
            this.loadModalComponent(AlbumEditModalComponent);
            break;
        }
        options = {selectedObjects: this.selectedObjects};
        break;
      case 'sharingModal':
        this.loadModalComponent(SharingModalComponent);
        options = {selectedObjects: this.selectedObjects};
        break;
      case 'taggingModal':
        this.loadModalComponent(TaggingModalComponent);
        options = {selectedObjects: this.selectedObjects};
        break;
      case 'addToAlbumModal':
        this.loadModalComponent(AddToAlbumModalComponent);
        options = {selectedObjects: this.selectedObjects};
        break;
      case 'createAlbumModal':
        this.loadModalComponent(AlbumCreateModalComponent);
        options = {selectedObjects: this.selectedObjects};
        break;
      case 'previewModal':
        this.loadModalComponent(PhotoDetailModalComponent);
        options = {show: true, showDetails: false, selectedObjects: this.selectedObjects};
        // this.modal.event.subscribe((event: any) => {
        //   this.doAction(event);
        // });
        break;
      case 'previewDetailsModal':
        this.loadModalComponent(PhotoDetailModalComponent);
        options = {show: true, showDetails: true, selectedObjects: this.selectedObjects};
        // this.modal.event.subscribe((event: any) => {
        //   this.doAction(event);
        // });
        break;
    }
    this.modal.open(options);
  }

  closeModal() {
    this.modal.close();
  }

  private loadModalComponent(component: any) {
    let modalComponentFactory = this.resolver.resolveComponentFactory(component);
    this.modalContainer.clear();
    this.modalComponent = this.modalContainer.createComponent(modalComponentFactory);
    this.modal = this.modalComponent.instance;

    // handle all of action from modal all
    this.modal.event.subscribe((event: any) => {

      // considering moving doAction into list-media
      this.doAction(event);
    });
  }
}
