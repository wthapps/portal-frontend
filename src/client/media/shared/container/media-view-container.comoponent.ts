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
import { ZMediaFormAddToAlbumComponent } from '../form/form-add-to-album.component';
import { ZMediaFormEditAlbumComponent } from '../form/form-edit-album.component';
import { AlbumCreateComponent } from '../form/album-create.component';
import { ZMediaPhotoFormEditComponent } from '../../photo/form/form-edit-photo.component';
import { BaseObjectEditNameModalComponent } from '../form/form-edit-name.component';

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
    ZMediaFormAddToAlbumComponent,
    ZMediaFormEditAlbumComponent,
    ZMediaPhotoFormEditComponent,
    AlbumCreateComponent,
    BaseObjectEditNameModalComponent,
    ZMediaFormEditAlbumComponent
  ]
})
export class MediaViewContainerComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() objectType: string;
  @Input() pageType: string = 'list';


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

  constructor(
    private resolver: ComponentFactoryResolver,
    private router: Router,
    private route: ActivatedRoute,
    private mediaObjectService: MediaObjectService,
    private confirmationService: ConfirmationService) {

  }

  ngOnInit() {

    this.router.events.subscribe((router: any) => {
      let paths = router.url.toString().split('/');
      this.currentPath = paths[1];
      if(this.currentPath == '') { // to be redirected from media home page
        this.currentPath = 'photos';
      }
      if (paths.length <= 2) {
        this.pageType = 'list';
      } else {
        this.pageType = 'detail';
      }

      this.currentPage = `${this.currentPath.slice(0,-1)}_${this.pageType}`;
      console.log('current page', this.currentPage);

      this.list.initProperties({
        currentPage: this.currentPage,
        currentPath: this.currentPath,
        objectType: this.objectType,
        pageType: this.pageType
      });

      this.toolbar.initProperties({
        currentPage: this.currentPage,
        currentPath: this.currentPath,
        objectType: this.objectType,
        pageType: this.pageType
      });


      this.route.queryParams.subscribe(
        (queryParams: any) => {
          // console.log('query params', queryParams);
        }
      );
      return; // prevent doing multi times
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
        this.upload();
          break;
      case 'share':
        this.share();
          break;
      case 'favourite':
        this.favourite();
          break;
      case 'tag':
        this.tag();
          break;
      case 'addToAlbum':
        this.addToAlbum();
            break;
      case 'createAlbum':
        this.createAlbum();
        break;
      case 'download':
        this.download();
          break;
      case 'edit':
        this.edit();
          break;
      case 'editName':
        this.editName();
            break;
      case 'editInfo':
        this.editInfo();
        break;
      case 'delete':
        this.delete();
          break;
      case 'changeView':
        this.changeView(event.params.viewOption);
        break;
      case 'preview':
      case 'previewAll':
        this.preview();
          break;
      case 'viewInfo':
      case 'viewDetails':
        if (this.currentPath == 'albums' || this.selectedObjects[0].object_type == 'album') {
          this.viewDetails();
        } else {
          this.viewInfo();
        }
        break;
      case 'slideShow':
        this.slideShow();
        break;
      case 'changeCoverImage':
        this.changeCoverImage();
        break;
      case 'select':
      case 'deselect':
        this.selectedObjects = event.params.selectedObjects;
        this.toolbar.updateAttributes({selectedObjects: this.selectedObjects});
          break;
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
    this.loadModalComponent(ZMediaFormAddToAlbumComponent);
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
      this.loadModalComponent(ZMediaFormEditAlbumComponent);
      this.modal.open();
    }

  }

  editName() {
    this.loadModalComponent(BaseObjectEditNameModalComponent);
    this.modal.open();
  }

  editInfo() {
    if(this.currentPath == 'photos') {
      this.loadModalComponent(ZMediaPhotoFormEditComponent);
      this.modal.open();
    } else if(this.currentPath == 'albums') {
      // this.loadModalComponent(ZMediaFormEditAlbumComponent);
      // this.modal.open();
    }

  }

  delete() {
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

  changeView(viewOption: string) {
    this.list.changeView(viewOption);
  }

  //*
  // Album's functions
  //
  // *//

  createAlbum(){
    this.loadModalComponent(AlbumCreateComponent);
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
  }
}
