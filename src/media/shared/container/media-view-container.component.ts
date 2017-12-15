import {
  Component, OnInit, ViewChild, ViewContainerRef, AfterViewInit,
  ComponentFactoryResolver, OnDestroy, Input, OnChanges, SimpleChanges, ChangeDetectorRef
} from '@angular/core';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { Location } from '@angular/common';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/withLatestFrom';

import { MediaToolbarListComponent } from '../media/media-toolbar-list.component';
import { MediaListComponent } from '../media/media-list.component';
import { MediaObjectService } from './media-object.service';
import { AlbumDetailInfoComponent } from '../../album/album-detail-info.component';
import { ZMediaAlbumService } from '../../album/album.service';
import { MediaUploaderDataService } from '../uploader/media-uploader-data.service';
import { ZMediaStore } from '../store/media.store';
import { TaggingModalComponent } from '@shared/shared/components/photo/modal/tagging/tagging-modal.component';
import { SharingModalComponent } from '@wth/shared/shared/components/photo/modal/sharing/sharing-modal.component';
import { BaseObjectEditNameModalComponent } from '@shared/shared/components/photo/modal/base-object-edit-name-modal.component';
import { AlbumCreateModalComponent } from '@wth/shared/shared/components/photo/modal/album-create-modal.component';
import { AlbumEditModalComponent } from '@shared/shared/components/photo/modal/album-edit-modal.component';
import { AlbumDeleteModalComponent } from '@wth/shared/shared/components/photo/modal/album-delete-modal.component';
import { FileSelectComponent } from '@wth/shared/shared/components/file/file-select/file-select.component';
import { PhotoDetailPartialComponent } from '@shared/shared/components/photo/detail/photo-detail-partial.component';
import { PhotoEditModalComponent } from '@wth/shared/shared/components/photo/modal/photo-edit-modal.component';
import { AddToAlbumModalComponent } from '@wth/shared/shared/components/photo/modal/add-to-album-modal.component';
import { WthConfirmService } from '@wth/shared/shared/components/confirmation/wth-confirm.service';

import { saveAs } from 'file-saver';
// declare var saveAs: any;

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

    SharingModalComponent,
    TaggingModalComponent,

    BaseObjectEditNameModalComponent,

    AlbumCreateModalComponent,
    AlbumEditModalComponent,
    AlbumDetailInfoComponent,
    AlbumDeleteModalComponent,

    // FileSelectModalComponent,
    FileSelectComponent,
    PhotoDetailPartialComponent,
    PhotoEditModalComponent,
    AddToAlbumModalComponent
  ]
})
export class MediaViewContainerComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
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
  @Input() object: any; // object for detail pages
  @Input() page: string;
  @Input() recipients: any;
  @Input() showDetailInfo: boolean = false;


  @ViewChild('toolbarContainer', {read: ViewContainerRef}) toolbarContainer: ViewContainerRef;
  @ViewChild('listContainer', {read: ViewContainerRef}) listContainer: ViewContainerRef;
  @ViewChild('infoContainer', {read: ViewContainerRef}) infoContainer: ViewContainerRef;
  @ViewChild('modalContainer', {read: ViewContainerRef}) modalContainer: ViewContainerRef;


  toolbarComponent: any;
  listComponent: any;
  detailInfoComponent: any;
  modalComponent: any;

  toolbar: any;
  list: any;
  detailInfo: any;
  modal: any;

  currentPath: string; // photos, albums, share-with-me, favourite
  selectedObjects: Array<any> = [];
  objects: any;


  viewOption: string = 'grid';
  private currentPage: string;
  private destroySubject: Subject<any> = new Subject<any>();

  // you are also able to inject PhotoService and AlbumService here for calling existing functions quickly
  constructor(private resolver: ComponentFactoryResolver,
              private router: Router,
              private route: ActivatedRoute,
              private location: Location,
              private mediaObjectService: MediaObjectService,
              private albumService: ZMediaAlbumService,
              private mediaUploaderDataService: MediaUploaderDataService,
              private mediaStore: ZMediaStore,
              private cdr: ChangeDetectorRef,
              private wthConfirmService: WthConfirmService) {

  }

  ngOnInit() {
    // this.currentPath = `${this.objectType}s`;
    // this.currentPath = this.router.url.toString().split('/')[1].split('?')[0]; // currentPath: photos, albums, shared-with-me
    this.route.url
      .withLatestFrom(this.route.parent.url)
      .map((pair: any) => {
        return _.find(pair, (url: any) => _.get(url, '0') != undefined);})
      .map((url: any) => url[0].path)
      .takeUntil(this.destroySubject)
      .subscribe((url: any) => this.currentPath = url); // currentPath: photos, albums, shared-with-me

    this.currentPage = `${this.objectType}_${this.pageType}`;

  }

  updateMediaList(res: any) {
    if (this.page == 'photos') {
      this.list.objects.unshift(res);
    }
    if (this.page == 'album_detail') {
      this.albumService.addToAlbum(this.params['id'], [res]).toPromise().then((res: any) => {
        this.list.objects = res.data;
        this.refreshPrimaryList();
      });
    }
  }

  ngAfterViewInit(): void {

    this.createToolbarComponent();

    // Init data
    this.toolbar.initProperties({
      currentPage: this.currentPage,
      currentPath: this.currentPath,
      objectType: this.objectType,
      pageType: this.pageType,
      object: this.object,
      page: this.page
    });

    // subscribe event
    this.toolbar.events.takeUntil(this.destroySubject).subscribe((event: any) => {
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

    this.list.events.takeUntil(this.destroySubject).subscribe((event: any) => {
      this.doAction(event);
    });

    this.createDetailInfoComponent();
    this.detailInfo.event.takeUntil(this.destroySubject).subscribe((event: any) => {
      this.doAction(event);
    });

    //  Listen to media uploader events
    this.mediaUploaderDataService.action$.takeUntil(this.destroySubject).subscribe((event: any) => {
      this.doAction(event);
    });

    this.cdr.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['object'] != undefined && changes['object'].currentValue != undefined) {
      this.updateObjectChanges();
    }
  }

  updateObjectChanges() {
    if (this.toolbar != undefined) {
      this.toolbar.updateProperties({object: this.object});
    }
    if (this.detailInfo != undefined) {
      this.detailInfo.updateProperties({object: this.object});
    }
  }

  createToolbarComponent() {
    let tbComponentFactory = this.resolver.resolveComponentFactory(MediaToolbarListComponent);
    this.toolbarContainer.clear();
    this.toolbarComponent = this.toolbarContainer.createComponent(tbComponentFactory);
    this.toolbar = <MediaToolbarListComponent>this.toolbarComponent.instance;
    this.toolbar.page = this.page;
    // this.subscribeUploader();
  }

  createListComponent() {
    let listComponentFactory = this.resolver.resolveComponentFactory(MediaListComponent);
    this.listContainer.clear();
    this.listComponent = this.listContainer.createComponent(listComponentFactory);
    this.list = <MediaListComponent>this.listComponent.instance;
    this.list.selectedObjects = this.selectedObjects;
    this.list.page = this.page;
  }

  createDetailInfoComponent() {
    let detailInfoComponentFactory = this.resolver.resolveComponentFactory(AlbumDetailInfoComponent);
    this.infoContainer.clear();
    this.detailInfoComponent = this.infoContainer.createComponent(detailInfoComponentFactory);
    this.detailInfo = <AlbumDetailInfoComponent>this.detailInfoComponent.instance;
    this.detailInfo.selectedObjects = this.selectedObjects;
  }

  ngOnDestroy() {
    // this.list.events.unsubscribe();
    this.destroySubject.next('');
    this.destroySubject.unsubscribe();
  }

  // considering moving doAction into list-media
  doAction(event: any) {
    console.log('doAction: ', event);
    switch (event.action) {
      case 'select':
      case 'deselect':
        this.selectedObjects = event.params.selectedObjects;
        this.toolbar.updateProperties({selectedObjects: this.selectedObjects});
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
        this.closeModal();
        break;

      case 'openUploadModal':
        this.mediaUploaderDataService.onShowUp();
        break;

      case 'previewAllPhotos': {
        let ids2 = _.map(this.mediaStore.getSelectedObjects(), 'id');
        let selectedIdx = this.mediaStore.getCurrentSelectedIndex();

        this.router.navigate([{outlets: {modal: [
            'photos',
            this.mediaStore.getSelectedObjects()[selectedIdx].id,
            {ids: ids2, mode: 0}
          ]}}], {queryParamsHandling: 'preserve', preserveFragment: true}
        );

        break;
      }

      case 'previewAllPhotosToolBar': {
        let ids = _.map(this.list.objects, 'id');

        if(ids.length > 0) {
          this.router.navigate([{outlets: {modal: [
              'photos',
              ids[0],
              {ids: ids, mode: 0}
            ]}}], {queryParamsHandling: 'preserve', preserveFragment: true}
          );
        }
        break;
      }

      case 'previewModal':
        let ids = _.map(this.selectedObjects, 'id');
        this.router.navigate([{outlets: {modal: [
            'photos',
            this.selectedObjects[0].id,
            {ids: ids, mode: 0}
          ]}}], {queryParamsHandling: 'preserve', preserveFragment: true}
        );

        break;
      case 'updateMediaList':
        this.updateMediaList(event.params.data);
        break;
      case 'updateDetailObject':
        this.updateDetailObject(event.params.properties);
        break;
      case 'download':
        this.download(event.params.selectedObjects);
        break;
      case 'downloadAlbum':
        this.downloadAlbum(event.params.selectedObjects[0]);
        break;
      case 'downloadAllToolbar':
        this.download(this.list.objects);
        break;
      default:
        this.list.doAction(event);
        break;
    }
  }

  upload() {
    // this.loadModalComponent(MediaUloaderComponent);
    return;
  }

  showUploadedPhoto(photo: any) {
    console.debug('Photo uploaded: ', photo);

    // TODO: Handle album details
    if (this.currentPath == 'photos') {
      // Add objects to media list
      this.list.objects.unshift(photo);
    }
  }

  showNewAlbum(album: any) {
    console.debug('New album: ', album);

    if (this.currentPath == 'albums') {
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
    return;
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
    this.loadModalComponent(PhotoEditModalComponent);
    this.modal.open({show: true, showDetails: true, selectedObjects: this.selectedObjects});
  }

  downloadAlbum(album: any) {
    let self = this;
    this.albumService.getPhotosByAlbum(album.id).toPromise().then(
      (response: any) => {
        self.download(response.data);
      }, (error: any) => {

      });
  }

  download(files: any) {
    _.each(files, (file: any) => {
      this.mediaObjectService.download({id: file.id}).toPromise().then(
        (response: any) => {
          var blob = new Blob([response], {type: file.content_type});
          saveAs(blob, file.name + '.' + file.extension);
        },
        (error: any) => {

        }
      );
    });
  }

  edit() {
    if (this.currentPath == 'photos') {

    } else if (this.currentPath == 'albums') {
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
    if (this.currentPath == 'photos') {
      this.loadModalComponent(PhotoEditModalComponent);
      this.modal.open({selectedObjects: this.selectedObjects});
    } else if (this.currentPath == 'albums') {
      // this.loadModalComponent(ZMediaFormEditAlbumComponent);
      // this.modal.open();
    }

  }

  goBack() {
    const tree: UrlTree = this.router.parseUrl(this.router.url);
    if( tree.root.children.detail )
      this.router.navigate([{outlets: {detail: null}}]);
    else
      this.location.back();

  }

  openModal(params: any) {
    let options: any;
    switch (params.modalName) {
      case 'editNameModal':
        this.loadModalComponent(BaseObjectEditNameModalComponent);
        options = {selectedObject: this.selectedObjects[0]};
        if (params.selectedObjects) options = {selectedObject: params.selectedObjects[0]};
        break;
      case 'editInfoModal':
        let object = params.detail == true ? this.object : this.selectedObjects[0] || this.object;
        this.loadModalComponent(
          object.object_type == 'photo' ? PhotoEditModalComponent : AlbumEditModalComponent
        );
        options = {selectedObject: object};
        this.objectType = object.object_type;
        break;
      case 'deleteModal':
        // switch (this.objectType) {
        switch (params.selectedObjects[0].object_type) {
          case 'album':
            // this.loadModalComponent();
            // options = {selectedObject: this.object};
            this.loadModalComponent(AlbumDeleteModalComponent);
            options = {selectedObjects: params.selectedObjects};
            // options = {selectedObjects: _.filter(this.selectedObjects, (o: any) => o.object_type == 'album')};
            console.log('deleteModal album');
            break;
        }
        break;
      case 'sharingModal':
        this.loadModalComponent(SharingModalComponent);
        var objects = _.get(params, 'selectedObjects', []).concat(this.selectedObjects);
        options = {selectedObjects: objects, updateListObjects: params.updateListObjects};
        break;
      case 'sharingModalToolbar': {
        this.loadModalComponent(SharingModalComponent);
        options = {sharing: this.params, recipients: this.recipients};
        break;
      }
      case 'taggingModal':
        this.loadModalComponent(TaggingModalComponent);
        if (params.object) {
          options = {selectedObjects: [this.toolbar.object], toolbar: this.toolbar};
        } else {
          options = {selectedObjects: this.selectedObjects, updateListObjects: [this.list.objects]};
        }
        break;
      case 'addToAlbumModal':
        this.loadModalComponent(AddToAlbumModalComponent);
        // Take selected photos from photo list screen OR uploaded photos from upload photo component
        options = {selectedObjects: ( params.data != undefined ) ? params.data : this.selectedObjects};
        break;
      case 'createAlbumModal':
        this.loadModalComponent(AlbumCreateModalComponent);
        // Take selected photos from photo list screen OR uploaded photos from upload photo component
        options = {selectedObjects: ( params.data != undefined ) ? params.data : this.selectedObjects};
        break;
      case 'previewDetailsModal':
        let ids: any[] = _.map(this.selectedObjects, 'id');
        if (this.selectedObjects[0].object_type == 'album') {
          this.router.navigate([{outlets: {detail: [
              `${this.selectedObjects[0].object_type}s`,
              this.selectedObjects[0].id,
              {ids: ids, mode: 0, showDetail: true}
            ]}}], {preserveQueryParams: true, preserveFragment: true}
          );
        } else {
          this.router.navigate([{outlets: {modal: [
              `${this.selectedObjects[0].object_type}s`,
              this.selectedObjects[0].id,
              {ids: ids, mode: 0, showDetail: true}
            ]}}], {preserveQueryParams: true, preserveFragment: true}
          );
        }


        break;
      //  Add uploaded photos to album detail
      case 'photosSelectModal':
        this.loadModalComponent(FileSelectComponent);
        options = {};
        break;
    }
    if (this.modal) {
      this.modal.open(options);
    }
  }

  closeModal() {
    this.modal.close();
  }

  updateDetailObject(properties: any) {
    _.forEach(properties, (property: any) => {
      this.object[property.key] = property.value;
    });

    this.toolbar.updateProperties({object: this.object});
  }

  private selectAllPhotos() {
    this.selectedObjects.length = 0;
    this.selectedObjects.push(..._.filter(this.objects, ['object_type', 'photo']));
    this.mediaStore.selectObjects(this.selectedObjects);
  }

  private refreshPrimaryList(): void {
    this.router.navigate([], {queryParams: {r: new Date().getTime()}});
  }

  private loadModalComponent(component: any) {
    let modalComponentFactory = this.resolver.resolveComponentFactory(component);
    this.modalContainer.clear();
    this.modalComponent = this.modalContainer.createComponent(modalComponentFactory);
    this.modal = this.modalComponent.instance;

    // handle all of action from modal all
    this.modal.event.takeUntil(this.destroySubject).subscribe((event: any) => {

      // considering moving doAction into list-media
      this.doAction(event);
    });
  }
}
