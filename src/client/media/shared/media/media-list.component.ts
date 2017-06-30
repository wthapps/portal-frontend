import {
  Component, Input, Output, EventEmitter, AfterViewInit, OnInit, HostListener, ElementRef,
  ViewContainerRef, ViewChild, ComponentFactoryResolver, OnDestroy, ViewEncapsulation
} from '@angular/core';
import { Location } from '@angular/common';
import { MediaObjectService } from '../container/media-object.service';
import { Constants } from '../../../core/shared/config/constants';
import { LoadingService } from '../../../core/partials/loading/loading.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/components/common/api';
import { ZMediaAlbumService } from '../../album/album.service';
import { PhotoService } from '../../../core/shared/services/photo.service';
import { Subject } from 'rxjs/Subject';
import { SharingModalComponent } from '../../../core/shared/components/photo/modal/sharing/sharing-modal.component';
import { TaggingModalComponent } from '../../../core/shared/components/photo/modal/tagging/tagging-modal.component';
import { PhotoEditModalComponent } from '../../../core/shared/components/photo/modal/photo-edit-modal.component';
import { BaseObjectEditNameModalComponent } from '../../../core/shared/components/photo/modal/base-object-edit-name-modal.component';
import { PhotoDetailModalComponent } from '../../../core/shared/components/photo/modal/photo-detail-partial.component';
import { AlbumDeleteModalComponent } from '../../../core/shared/components/photo/modal/album-delete-modal.component';
import { AlbumEditModalComponent } from '../../../core/shared/components/photo/modal/album-edit-modal.component';
import { AlbumCreateModalComponent } from '../../../core/shared/components/photo/modal/album-create-modal.component';

declare var _: any;
declare var $: any;

@Component({
  moduleId: module.id,
  encapsulation: ViewEncapsulation.None,
  selector: 'me-list',
  templateUrl: 'media-list.component.html',
  styleUrls: ['media-list.component.css'],
  providers: [
    MediaObjectService
  ],
  entryComponents: [
    BaseObjectEditNameModalComponent,
    PhotoEditModalComponent,
    AlbumCreateModalComponent,
    AlbumEditModalComponent,
    AlbumDeleteModalComponent,
    PhotoDetailModalComponent,
    TaggingModalComponent,
    SharingModalComponent
  ]
})

export class MediaListComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() selectedObjects: Array<any> = new Array<any>();
  // @Input() type: string = 'photo';
  // @Input() objects: any;

  @Output() events: EventEmitter<any> = new EventEmitter<any>();

  // @ViewChild('modalContainer', { read: ViewContainerRef }) modalContainer: ViewContainerRef;


  readonly LIST_TYPE = {photo: 'photo', album: 'album', mix: 'mix'};
  readonly TYPE_MAPPING: any = Constants.mediaListDetailTypeMapping;
  readonly MIX_SCREEN: Array<string> = ['shared-with-me', 'favourites'];

  // modalComponent: any;
  // modal: any;

  sliderViewNumber: number = Constants.mediaSliderViewNumber.default;
  viewOption: string = 'grid';

  groupByTime: string;
  currentGroupByTime: string = 'date';
  groupBy: string;

  //this is used in list pages
  objects: Array<any> = new Array<any>();
  hasObjects: boolean = true;

  // this is used in detail pages
  object: any;
  page: string;

  // this is used in album list pages
  photos: any = [];


  currentPath: string; //photos, albums, videos, playlist, share-with-me, favourites
  nextLink: string;

  private pressingCtrlKey: boolean = false;

  private currentPage: string;
  private objectType: string; //photo, album, video, playlist, all
  private params: any;
  private currentView: number;
  private destroySubject: Subject<any> = new Subject<any>();


  @HostListener('document:keydown', ['$event'])
  onKeyDown(ke: KeyboardEvent) {
    if (this.pressedCtrlKey(ke)) {
      this.pressingCtrlKey = true;
    }
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(ke: KeyboardEvent) {
    if (this.pressedCtrlKey(ke)) {
      this.pressingCtrlKey = false;
    }

    //if0 pressing ESC key
    if (ke.keyCode == 27) {
      this.deSelectObjects();
    }
  }

  // @HostListener('document:click', ['$event'])
  // clickout(event: any) {
  //
  //   // if clicking on menu
  //   if ($(event.target).hasClass('fa')) return;
  //
  //   // if clicking outside item
  //   if(this.elementRef.nativeElement.contains(event.target)) return;
  //
  //      this.deSelectObjects();
  // }
  constructor(protected resolver: ComponentFactoryResolver,
              protected elementRef: ElementRef,
              protected router: Router,
              protected route: ActivatedRoute,
              protected confirmationService: ConfirmationService,
              protected loadingService: LoadingService,
              protected mediaObjectService: MediaObjectService,
              protected photoService: PhotoService,
              protected location: Location,
              protected albumService: ZMediaAlbumService) {

  }


  ngOnInit(): void {

  }

  ngAfterViewInit() {
    // this.getObjects();
    this.route.queryParams
      .filter(() => this.currentPath != undefined)
      .subscribe(
        (queryParams: any) => {
          this.getObjects(queryParams);
        }
      );

    // if(this.MIX_SCREEN.includes(this.currentPath))
    if (this.MIX_SCREEN.indexOf(this.currentPath) > -1)
      this.changeView('grid'); // Default view should be grid
  }

  ngOnDestroy() {
    this.currentView = 0;
    this.destroySubject.next('');
    this.destroySubject.unsubscribe();    // Destroy unused subscriptions
  }

  getObjects(options?: any) {
    let path = this.currentPath;
    let moreOptions = {};

    if (this.page == 'favorites') {
      this.loadingService.start('#list-photo');
      this.mediaObjectService.getObjects(`media?list_type=favorites`)
        .takeUntil(this.destroySubject)
        .subscribe((response: any)=> {
        this.loadingService.stop('#list-photo');
        this.objects = response.data;
        this.nextLink = response.page_metadata.links.next;
        if (response.data.length==0) {
          this.hasObjects = false;
        }
      });
      return;
    }

    if (this.page == 'album_detail' && this.params && options && Object.keys(options).length > 0) {
      // options['album'] = this.params['id'];
      moreOptions = Object.assign({}, options, {'album': this.params['id']});
      this.loadingService.start('#list-photo');
      this.mediaObjectService.getObjects(`photos`, moreOptions)
        .takeUntil(this.destroySubject)
        .subscribe((response: any)=> {
        this.loadingService.stop('#list-photo');
        this.objects = response.data;
        this.nextLink = response.page_metadata.links.next;
        if (response.data.length==0) {
          this.hasObjects = false;
        }
      });
      return;
    }

    if (this.params) {
      this.loadingService.start('#list-photo');
      this.mediaObjectService.getObjects(`photos`, {album: this.params['id']})
        .takeUntil(this.destroySubject)
        .subscribe((response: any)=> {
        this.loadingService.stop('#list-photo');
        this.objects = response.data;
        this.nextLink = response.page_metadata.links.next;
        if (response.data.length==0) {
          this.hasObjects = false;
        }
      });
      return;
    }

    this.loadingService.start('#list-photo');
    this.mediaObjectService.getObjects(this.currentPath, options)
      .takeUntil(this.destroySubject)
      .subscribe((response: any)=> {
      this.loadingService.stop('#list-photo');
      this.objects = response.data;
      this.nextLink = response.page_metadata.links.next;
      if (response.data.length==0) {
        this.hasObjects = false;
      }
    });
  }

  getMoreObjects() {
    // this.loadingService.start('#list-photo');
    if (this.nextLink != null) { // if there are more objects
      // this.mediaObjectService.getObjects(this.nextLink).subscribe((response: any)=> {
      this.mediaObjectService.loadMore(this.nextLink)
        .takeUntil(this.destroySubject)
        .subscribe((response: any)=> {
        // this.loadingService.stop('#list-photo');
        this.objects.push(...response.data);
        this.nextLink = response.page_metadata.links.next;
      });
    }

  }

  initProperties(properties: any) {
    this.objectType = properties.objectType;
    this.currentPath = properties.currentPath;
    this.currentPage = properties.currentPage;
    this.params = properties.params;
  }


  onDragenter(e: any) {
    e.preventDefault();
    // if (!this.selectablesEnable) {
    //   this.selectables.enable();
    // }
  }

  onDragleave(e: any) {
    e.preventDefault();
    // this.selectablesEnable = false;
  }

  onAction(options: any) {
    if (options.action == 'select') {
      this.selectObject(options.params.selectedObject);
      options = {action: 'select', params: {selectedObjects: this.selectedObjects}};
    }

    this.doAction(options);
    switch (options.action) {
      case 'select':
      case 'deselect':
      case 'goBack':
      case 'openModal':
      case 'updateDetailObject':
        this.events.emit(options);
        break;
    }
  }

  changeView(viewOption: string) {
    this.viewOption = viewOption;
    if (this.viewOption == 'grid') {
      this.groupByTime = '';
      this.groupBy = 'object_type';
    }
    if (this.viewOption == 'list') {
      this.groupByTime = '';
      this.groupBy = '';
    }
    if (this.viewOption == 'timeline') {
      this.groupByTime = this.currentGroupByTime;
      this.groupBy = 'created_at_converted';
    }
  }

  actionSortbar(event: any) {
    console.log(event);
    if (event.action == 'slider') {
      this.sliderViewNumber = event.number;
    }
    if (event.action == 'sort') {
      this.sort(event.data);
    }
    if (event.action == 'group') {
      this.groupByTime = event.data;
      this.currentGroupByTime = this.groupByTime;
    }
  }

  actionItem(ev: any) {
    console.log('raise event:', ev);
    this.events.emit(ev);
  }

  // considering moving doAction into list-media
  doAction(event: any) {
    // console.log('event in list media::', event);
    switch (event.action) {
      case 'uploadPhoto':
        this.upload();
        break;
      case 'photoSelectNext':
        this.addPhotosToList(event.params.data);
        break;
      case 'showUploadedPhotos':
        this.showUploadedPhotos(event.params.data);
        break;
      case 'share':
        this.share();
        break;
      case 'favourite':
        this.favourite(event.params);
        break;
      case 'tag':
        this.tag();
        break;
      case 'addToAlbum':
        this.addToAlbum(event.data);
        break;
      case 'createAlbum':
        this.createAlbum(event.data);
        break;
      case 'showNewAlbum':
        this.showNewAlbum(event.data);
        break;
      case 'download':
        this.download();
        break;
      case 'edit':
        this.edit();
        break;
      case 'editName':
        this.editName(event.params.selectedObject);
        break;
      case 'editInfo':
        this.editInfo(event.params.selectedObject);
        break;
      case 'delete':
        this.delete();
        break;
      // case 'deleteAlbum':
      //   this.deleteAlbum(event.params.selectedObject);
      //   break;
      // case 'deleteAlbumPhotos':
      //   this.deleteAlbumPhotos(event.params.selectedObjects);
      //   break;

      // Delete albums and photos in list screen: photo list, album list, favorites list, album detail screen
      case 'deleteMedia':
        this.deleteMedia(event.params);
        break;
      case 'confirmDeleteMedia':
        this.confirmDeleteMedia(event.params);
        break;
      // Hide photos / albums present in shared-with-me screen
      case 'hideMedia':
        this.hideMedia(event.params);
        break;
      //  Delete album itself in album detail screen
      case 'deleteAlbumAndBack':
        this.deleteAlbumAndBack(event.params);
        break;
      case 'removeFromAlbum':
        this.removeFromAlbum(event.params);
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
        if (this.selectedObjects[0].object_type == 'album') {
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
        // this.toolbar.updateAttributes({selectedObjects: this.selectedObjects});
        break;
    }
  }

  upload() {
    // this.loadModalComponent(MediaUloaderComponent);

  }

  preview() {
    // open modal
    // this.loadModalComponent(PhotoDetailModalComponent);
    // this.modal.open({show: true, showDetails: false, selectedObjects: this.selectedObjects});
    // this.modal.event.subscribe((event: any) => {
    //   this.doAction(event);
    // });
  }

  share() {
    // this.loadModalComponent(SharingModalComponent);
    // this.modal.open({selectedItems: this.selectedObjects});
  }

  favourite(params: any) {
    let body: any;
    let selectedIndex: number = -1;
    let mode = params.mode;

    // single favourite
    if (params.hasOwnProperty('selectedObject')) {
      body = {
        objects: [_.pick(params.selectedObject, ['id', 'object_type'])],
        mode: mode
      };
      selectedIndex = _.findIndex(this.objects, ['id', params.selectedObject.id]);

    } else { // multi-favourite
      body = {
        objects: _.map(this.selectedObjects, (object: any) => {
          return _.pick(object, ['id', 'object_type']);
        }),
        mode: mode
      };
    }

    let self = this;

    this.mediaObjectService.favourite(body)
      .takeUntil(this.destroySubject)
      .subscribe(
      (response: any) => {
        // update favourite attribute
        if (selectedIndex != -1) {
          this.objects[selectedIndex].favorite = (mode == 'add' ? true : false);
          // refresh objects if current page is favourite

          // update for album detail page
          if (params.hasOwnProperty('page') && params.page == 'album_detail') {
            // this.object.favorite = (mode == 'add' ? true : false);
            self.onAction({
              action: 'updateDetailObject',
              params: {properties: [{key: 'favorite', value: (mode == 'add' ? true : false)}]}
            });
          }
          if (mode == 'remove' && this.page == 'favorites') {
            // here just handles un-favourite ONE object
            this.objects.splice(selectedIndex, 1);
          }
         return;
        }

        _.map(this.selectedObjects, (object: any)=> {
          object.favorite = (mode == 'add' ? true : false);
        });
        if (mode == 'remove' && this.page == 'favorites') {
          _.remove(this.objects, (object: any) => {
            return false == object.favorite;
          });
        }

      },
      (error: any) => {
        console.log('error: ', error);
      }
    );
  }

  tag() {

    // this.modal.open();
  }

  addToAlbum(data?: any) {
    // this.loadModalComponent(AddToAlbumModalComponent);
    // let objects = (data != undefined) ? data : this.selectedObjects;
    // this.modal.open({selectedObjects: objects});
  }

  viewInfo() {
    // this.loadModalComponent(ZMediaPhotoDetailComponent);
    // this.modal.open({show: true, showDetails: true, selectedObjects: this.selectedObjects});
  }

  download() {

  }

  edit() {
    if (this.currentPath == 'photos') {

    } else if (this.currentPath == 'albums') {
      this.loadModalComponent(AlbumEditModalComponent);
      // this.modal.open();
    }

  }

  editName(selectedObject: any) {
    this.loadingService.start();
    if (selectedObject.object_type == 'photo') {
      let updated_at = new Date(selectedObject.created_at);
      let body = JSON.stringify({
        name: selectedObject.name,
        created_day: updated_at.getDate(),
        created_month: updated_at.getMonth() + 1,
        created_year: updated_at.getUTCFullYear(),
        description: selectedObject.description
      });

      this.photoService.updateInfo(selectedObject.id, body)
        .subscribe((res: any) => {
            // stop loading
            this.loadingService.stop();
          },
          (error: any) => {
            // stop loading
            this.loadingService.stop();
            console.log(error);
          }
        );
    } else if (selectedObject.object_type == 'album') {
      let body = JSON.stringify({
        name: selectedObject.name
      });

      this.albumService.updateInfo(selectedObject.id, body)
        .subscribe((res: any) => {
            // stop loading
            this.loadingService.stop();
          },
          (error: any) => {
            // stop loading
            this.loadingService.stop();
            console.log(error);
          }
        );
    }
  }

  editInfo(selectedObject: any) {
    this.loadingService.start();
    if (this.currentPath == 'photos') {
      let updated_at = new Date(selectedObject.created_at);
      let body = JSON.stringify({
        name: selectedObject.name,
        created_day: updated_at.getDate(),
        created_month: updated_at.getMonth() + 1,
        created_year: updated_at.getUTCFullYear(),
        description: selectedObject.description
      });
      this.photoService.updateInfo(selectedObject.id, body)
        .subscribe(
          (res: any) => {
            this.loadingService.stop();
          },
          (error: any) => {
            this.loadingService.stop();
          }
        );

    } else if (this.currentPath == 'albums') {
      let body = JSON.stringify({
        name: selectedObject.name,
        description: selectedObject.description,
      });
      this.albumService.updateInfo(selectedObject.id, body)
        .subscribe(
          (res: any) => {
            this.loadingService.stop();
          },
          (error: any) => {
            this.loadingService.stop();
          }
        );
    }
    console.log('call edit info method here');
  }

  delete() {
    console.log('testing...... detete:', this.selectedObjects);
    let objType = this.selectedObjects[0].object_type;
    let objIds = _.map(this.selectedObjects, 'id'); // ['1','2'];
    if (objType == 'photo') {
      this.confirmationService.confirm({
        message: 'Are you sure to delete ' + this.selectedObjects.length + ' ' + objType + (this.selectedObjects.length > 1 ? 's' : '') + ' ?',
        accept: () => {
          let body = JSON.stringify({ids: objIds});
          this.loadingService.start();

          this.photoService.deletePhoto(body).subscribe(
            (res: any)=> {
              _.map(objIds, (id: any)=> {
                _.remove(this.objects, ['id', id]);
              });
              this.loadingService.stop();
            });
        }
      });
    } else if (objType == 'album') {
      console.log('testing...... detete: album');
      // this.albumService.deleteAlbum(body).subscribe(
      //   (res: any)=> {
      //     _.map(objIds, (id: any)=> {
      //       _.remove(this.objects, ['id', id]);
      //     });
      //     this.loadingService.stop();
      //   });
    }
  }

  deleteAlbum(selectedObject: any) {
    this.loadingService.start();
    let objIds = _.get(selectedObject, 'id'); // ['1','2'];
    let body = JSON.stringify({ids: objIds});
    this.albumService.deleteAlbum(body).subscribe(
      (res: any)=> {
        _.map(objIds, (id: any)=> {
          _.remove(this.objects, ['id', id]);
        });
        this.loadingService.stop();
      });

  }

  deleteAlbumPhotos(selectedObject: any) {
    let _thisComponent = this;

    this.loadingService.start();
    let objIds = _.map(selectedObject, 'id'); // ['1','2'];
    let body = JSON.stringify({ids: objIds});

    _.map(selectedObject, (v: any) => {
      _thisComponent.albumService.getPhotosByAlbum(v.id).subscribe(
        (res: any) => {
          _.map(res.data, (vk: any) => {
            this.storagePhotos(vk.id);
          });
        }
      );
    });
    this.albumService.deleteAlbum(body).subscribe(
      (res: any)=> {
        _.map(objIds, (id: any)=> {
          _.remove(this.objects, ['id', id]);
        });
        // console.log('albumService after deleting: ', _.uniq(this.photos));
        let objPhotoIds: any = _.uniq(this.photos);
        this.photoService.deletePhoto({ids: objPhotoIds}).subscribe(
          (res: any) => {
            this.loadingService.stop();
          }
        );
      });
  }


  // Delete multiple objects: photos, albums
  // Allow delete photos in album (options)
  // Params format:
  // { objects: [{id: <value>, object_type: <value>}], child_destroy: <true/false> }
  deleteMedia(params: any) {
    let objs = _.map(params.selectedObjects, (o: any) => _.pick(o, ['id', 'object_type'])); // ['1','2'];

    this.loadingService.start();
    this.mediaObjectService.deleteObjects(objs, params.child_destroy).subscribe(
      (res: any) => {
        _.map(objs, (obj: any)=> {
          _.remove(this.objects, {'id': obj.id, 'object_type': obj.object_type});
        });
        this.loadingService.stop();
        if (params.callback)
          params.callback(); // Return back to previous screen OR go to next / previous photos
      },
      (error: any) => this.loadingService.stop());

  }

  confirmDeleteMedia(params: any) {
    // Ask for user confirmation before delete media items
    let photos = _.filter(params.selectedObjects, (o: any) => o.object_type == 'photo');
    let albums = _.filter(params.selectedObjects, (o: any) => o.object_type == 'album');
    let photos_count = photos.length  + (photos.length > 1 ? ' photos?' : ' photo?');

    console.log(photos, photos.length)
    if( photos.length > 0 ) {
      // Ask for user confirmation before deleting selected PHOTOS
      this.confirmationService.confirm({
        message: 'Are you sure to delete ' + photos_count,
        accept: () => {

          this.loadingService.start();
          this.mediaObjectService.deleteObjects(photos, params.child_destroy).subscribe(
            (res: any) => {
              _.map(photos, (obj: any)=> {
                _.remove(this.objects, {'id': obj.id, 'object_type': obj.object_type});
              });
              this.loadingService.stop();

              // Ask for user confirmation before deleting selected ALBUMS
              if (albums.length > 0)
                this.onAction({action: 'openModal', params: {modalName:'deleteModal', selectedObjects: albums}});
            },
            (error: any) => this.loadingService.stop());

        },
        reject: () => {
          // Ask for user confirmation before deleting selected ALBUMS
          if (albums.length > 0)
            this.onAction({action: 'openModal', params: {modalName:'deleteModal', selectedObjects: albums}});
        }
      });
    } else {
      // Ask for user confirmation before deleting selected ALBUMS
      this.onAction({action: 'openModal', params: {modalName:'deleteModal', selectedObjects: albums}});
    }

  }

  // Hide media present in shared with me screen
  hideMedia(params: any, callback?: any) {

  }

  // Delete album in album detail and go back to album list / favourite list
  deleteAlbumAndBack(params: any) {
    let newParams = Object.assign(params, {callback: this.location.back()});
    return this.deleteMedia(newParams);
  }

  removeFromAlbum(params: any) {

    console.log('selected album & object', params.selectedObject, params.selectedObjects);
    let ids = _.map(params.selectedObjects, 'id');
    this.confirmationService.confirm({
      message: 'Are you sure to remove all selected photos from this album',
      accept: () => {
        this.loadingService.start();

        this.albumService.removeFromAlbum(params.selectedObject.id, params.selectedObjects).subscribe(
          (response: any) => {
            console.log('before', this.objects);
            _.remove(this.objects, (object: any) => {
              return (_.indexOf(ids, object.id) !== -1);
            });

            console.log('after', this.objects);
            this.loadingService.stop();
          });
      }
    });
  }

  storagePhotos(id: number) {
    this.photos.push(id);
  }

  //*
  // Album's functions
  //
  // *//

  createAlbum(data?: any) {
    this.loadModalComponent(AlbumCreateModalComponent);
    let objects = data != undefined ? data : this.selectedObjects;
    // this.modal.open({selectedObjects: objects});
  }

  viewDetails() {
    if (this.page != 'shared-with-me')
      this.router.navigate(['/albums', this.selectedObjects[0].id]);
    else
      this.router.navigate(['/albums', this.selectedObjects[0].id], {queryParams: {'shared-with-me': true}});
  }

  slideShow() {

  }

  changeCoverImage() {

  }

  showNewAlbum(data?: any) {
    console.debug('show new album: ', data);
  }

  showUploadedPhotos(data?: any) {
    console.debug('showUploadedPhotos: ', data);
  }

  addPhotosToList(photos?: any) {
    // Add data to album detail if possible
    if (['album_detail', 'albums'].indexOf(this.currentPath) > -1)
      this.albumService.addToAlbum(this.params.id, photos).take(1)
        .subscribe((res: any) => console.log(photos.length, ' photos are added to album - id: ', this.params.id),
          (err: any) => console.error('Errors when adding photos to album - id: ', this.params.id));

    this.objects.unshift(...photos);
  }

  private selectObject(item: any): void {

    if (this.pressingCtrlKey) {
      if (_.some(this.selectedObjects, ['id', item.id])) {
        $('#photo-box-img-' + item.id).removeClass('selected');
        _.remove(this.selectedObjects, ['id', item.id]);
      } else {
        $('#photo-box-img-' + item.id).addClass('selected');
        this.selectedObjects.push(item);
      }
    } else {
      $('.row-img .photo-box').removeClass('selected');
      $('#photo-box-img-' + item.id).addClass('selected');
      this.selectedObjects.length = 0;
      this.selectedObjects.push(item);
    }
  }

  private deSelectObjects() {
    if (this.selectedObjects.length > 0) {
      _.forEach(this.selectedObjects, (item: any) => {
        if (_.some(this.selectedObjects, ['id', item.id])) {
          $('#photo-box-img-' + item.id).removeClass('selected');
        }
      });

      // remove all selected objects
      this.selectedObjects.length = 0;
      this.onAction({action: 'deselect', params: {selectedObjects: this.selectedObjects}});
    }
  }

  private pressedCtrlKey(ke: KeyboardEvent): boolean {
    return ((ke.keyCode == 17 || ke.keyCode == 18 || ke.keyCode == 91 || ke.keyCode == 93 || ke.ctrlKey) ? true : false);
  }

  private loadModalComponent(component: any) {
    let modalComponentFactory = this.resolver.resolveComponentFactory(component);
    // this.modalContainer.clear();
    // this.modalComponent = this.modalContainer.createComponent(modalComponentFactory);
    // this.modal = this.modalComponent.instance;

    // handle all of action from modal all
    // this.modal.event.subscribe((event: any) => {
    //
    //   // considering moving doAction into list-media
    //   this.doAction(event);
    // });
  }

  private sort(data: any) {
    console.log(data);
    this.getObjects(data);
  }
}

