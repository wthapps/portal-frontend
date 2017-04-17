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
import { ZMediaSharingComponent } from '../sharing/sharing.component';
import { ZMediaTaggingComponent } from '../tagging/tagging.component';
import { AddToAlbumModalComponent } from '../modal/add-to-album-modal.component';
import { AlbumEditModalComponent } from '../modal/album-edit-modal.component';
import { AlbumCreateModalComponent } from '../modal/album-create-modal.component';
import { PhotoEditModalComponent } from '../../photo/form/photo-edit-modal.component';
import { BaseObjectEditNameModalComponent } from '../modal/base-object-edit-name-modal.component';

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
    AddToAlbumModalComponent,
    AlbumEditModalComponent,
    PhotoEditModalComponent,
    AlbumCreateModalComponent,
    BaseObjectEditNameModalComponent,
    AlbumEditModalComponent
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
  modalComponent: any;

  toolbar: MediaToolbarListComponent;
  list: MediaListComponent;
  modal: any;

  currentPath: string; // photos, albums, share-with-me, favourite
  selectedObjects: Array<any> = [];
  objects: Array<any>;

  viewOption: string = 'grid';
  private currentPage: string;

  // you are also able to inject PhotoService and AlbumService here for calling existing functions quickly
  constructor(
    private resolver: ComponentFactoryResolver,
    private router: Router,
    private route: ActivatedRoute,
    private mediaObjectService: MediaObjectService,
    private confirmationService: ConfirmationService) {

  }

  ngOnInit() {

    this.currentPath = `${this.objectType}s`;
    this.currentPage = `${this.objectType}_${this.pageType}`;

    // this.router.events.subscribe((router: any) => {
    //   let paths = router.url.toString().split('/');
    //   this.currentPath = paths[1];
    //   if(this.currentPath == '') { // to be redirected from media home page
    //     this.currentPath = 'photos';
    //   }
      // if (paths.length <= 2) {
      //   this.pageType = 'list';
      // } else {
      //   this.pageType = 'detail';
      // }

      // this.currentPage = `${this.currentPath.slice(0,-1)}_${this.pageType}`;
      console.log('current page', this.currentPage);




      // this.route.queryParams.subscribe(
      //   (queryParams: any) => {
      //     // console.log('query params', queryParams);
      //   }
      // );
      // return; // prevent doing multi times


    // });
  }

  ngAfterViewInit(): void {
    let tbComponentFactory = this.resolver.resolveComponentFactory(MediaToolbarListComponent);
    this.toolbarContainer.clear();
    this.toolbarComponent = this.toolbarContainer.createComponent(tbComponentFactory);
    this.toolbar = <MediaToolbarListComponent>this.toolbarComponent.instance;

    // Init data
    this.toolbar.initProperties({
      currentPage: this.currentPage,
      currentPath: this.currentPath,
      objectType: this.objectType,
      pageType: this.pageType
    });

    // subscribe event
    this.toolbar.events.subscribe((event: any) => {
      this.list.doAction(event);
    });

    let listComponentFactory = this.resolver.resolveComponentFactory(MediaListComponent);
    this.listContainer.clear();
    this.listComponent = this.listContainer.createComponent(listComponentFactory);
    this.list = <MediaListComponent>this.listComponent.instance;
    this.list.selectedObjects = this.selectedObjects;

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

  }

  ngOnDestroy() {
    this.list.events.unsubscribe();
  }

  loadMoreObjects() {

  }


  // considering moving doAction into list-media
  doAction(event: any) {
    switch(event.action) {
      // case 'uploadPhoto':
      //   this.upload();
      //     break;
      // case 'share':
      //   this.share();
      //     break;
      // case 'favourite':
      //   this.favourite();
      //     break;
      // case 'tag':
      //   this.tag();
      //     break;
      // case 'addToAlbum':
      //   this.addToAlbum();
      //       break;
      // case 'createAlbum':
      //   this.createAlbum();
      //     break;
      // case 'download':
      //   this.download();
      //     break;
      // case 'edit':
      //   this.edit();
      //     break;
      // case 'editName':
      //   this.editName(event.params.selectedObject);
      //       break;
      // case 'editInfo':
      //   this.editInfo(event.params.selectedObject);
      //     break;
      // case 'delete':
      //   this.delete();
      //     break;
      // case 'changeView':
      //   this.changeView(event.params.viewOption);
      //     break;
      // case 'preview':
      // case 'previewAll':
      //   this.preview();
      //     break;
      // case 'viewInfo':
      // case 'viewDetails':
      //   if (this.selectedObjects[0].object_type == 'album') {
      //     this.viewDetails();
      //   } else {
      //     this.viewInfo();
      //   }
      //   break;
      // case 'slideShow':
      //   this.slideShow();
      //   break;
      // case 'changeCoverImage':
      //   this.changeCoverImage();
      //     break;
      case 'select':
      case 'deselect':
        this.selectedObjects = event.params.selectedObjects;
        this.toolbar.updateAttributes({selectedObjects: this.selectedObjects});
          break;
      case 'goBack':
        this.goBack();
          break;

      // open all of modal
      // case 'openModal':
      //   this.openModal(event.params.modalName);
      //     break;
    }
  }

  upload() {
    // this.loadModalComponent(MediaUloaderComponent);

  }

  preview() {
    // open modal
    this.loadModalComponent(ZMediaPhotoDetailComponent);
    this.modal.open({show: true, showDetails: false, selectedObjects: this.selectedObjects});
    // this.modal.events.subscribe((event: any) => {
    //   this.doAction(event);
    // });
  }

  share() {
    this.loadModalComponent(ZMediaSharingComponent);
    this.modal.open({selectedItems: this.selectedObjects});
  }

  favourite() {

  }

  tag() {
    this.loadModalComponent(ZMediaTaggingComponent);
    this.modal.open();
  }

  addToAlbum() {
    this.loadModalComponent(AddToAlbumModalComponent);
    this.modal.open();
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
      this.loadModalComponent(ZMediaPhotoFormEditComponent);
      this.modal.open({selectedObjects: this.selectedObjects});
    } else if(this.currentPath == 'albums') {
      // this.loadModalComponent(ZMediaFormEditAlbumComponent);
      // this.modal.open();
    }

    console.log('call edit info method here');
  }

  // delete() {
  //   let objIds = _.map(this.selectedObjects, 'id'); // ['1','2'];
  //   this.confirmationService.confirm({
  //     message: 'Are you sure to delete ' + this.selectedObjects.length + ' item' + (this.selectedObjects.length > 1 ? 's' : '') + ' ?',
  //     accept: () => {
  //       let body = JSON.stringify({ids: objIds});
  //       // this.loadingService.start();
  //       // this.photoService.deletePhoto(body).subscribe((response: any)=> {
  //       //   _.map(idPhotos, (id: any)=> {
  //       //     _.remove(this.data, ['id', id]);
  //       //   });
  //       //   this.loadingService.stop();
  //       // });
  //     }
  //   });
  // }

  changeView(viewOption: string) {
    this.list.changeView(viewOption);
  }

  goBack() {
    switch (this.objectType) {
      case 'photo':
      case 'album':
        this.router.navigate([`/${this.objectType}s`]);
        break;
    }
  }


  openModal(modalName: string) {
    switch (modalName) {
      case 'editNameModal':
        this.loadModalComponent(BaseObjectEditNameModalComponent);
        break;
      case 'editInfoModal':
        this.loadModalComponent(PhotoEditModalComponent);
        break;
      case 'sharingModal':

        break;
      case 'taggingModal':

        break;

    }

    this.modal.open();

  }

  //*
  // Album's functions
  //
  // *//

  createAlbum(){
    this.loadModalComponent(AlbumCreateModalComponent);
    this.modal.open();
  }

  viewDetails() {
    this.router.navigate(['/albums', this.selectedObjects[0].id]);
  }

  slideShow() {

  }

  changeCoverImage() {

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
