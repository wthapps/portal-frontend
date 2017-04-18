import {
  Component, Input, Output, EventEmitter, AfterViewInit, OnInit, HostListener, ElementRef,
  ViewContainerRef, ViewChild, ComponentFactoryResolver
} from '@angular/core';
import { Location } from '@angular/common';
import { MediaObjectService } from '../container/media-object.service';
import { Constants } from '../../../core/shared/config/constants';
import { LoadingService } from '../../../core/partials/loading/loading.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseObjectEditNameModalComponent } from '../modal/base-object-edit-name-modal.component';
import { PhotoEditModalComponent } from '../../photo/form/photo-edit-modal.component';
import { AlbumCreateModalComponent } from '../modal/album-create-modal.component';
import { AlbumEditModalComponent } from '../modal/album-edit-modal.component';
import { SharingModalComponent } from '../modal/sharing/sharing-modal.component';
import { TaggingModalComponent } from '../modal/tagging/tagging-modal.component';
import { AddToAlbumModalComponent } from '../modal/add-to-album-modal.component';
import { ConfirmationService } from 'primeng/components/common/api';
import { PhotoDetailModalComponent } from '../modal/photo-detail-modal.component';
import { ZMediaPhotoService } from '../../photo/photo.service';
import { ZMediaAlbumService } from '../../album/album.service';

declare var _: any;
declare var $: any;

@Component({
  moduleId: module.id,
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
    PhotoDetailModalComponent,
    TaggingModalComponent,
    SharingModalComponent
  ]
})

export class MediaListComponent implements OnInit, AfterViewInit {
  @Input() selectedObjects: Array<any> = new Array<any>();
  // @Input() type: string = 'photo';
  // @Input() objects: any;

  @Output() events: EventEmitter<any> = new EventEmitter<any>();

  // @ViewChild('modalContainer', { read: ViewContainerRef }) modalContainer: ViewContainerRef;


  readonly LIST_TYPE = {photo: 'photo', album: 'album', mix: 'mix'};
  readonly TYPE_MAPPING: any = Constants.mediaListDetailTypeMapping;
  readonly MIX_SCREEN = [ 'shared-with-me', 'favorites'];

  // modalComponent: any;
  // modal: any;

  sliderViewNumber: number = Constants.mediaSliderViewNumber.default;
  viewOption: string = 'grid';

  groupByTime: string;
  currentGroupByTime: string = 'date';
  groupBy: string;
  objects: Array<any> = new Array<any>();
  currentPath: string; //photos, albums, videos, playlist, share-with-me, favourites
  previousPath: any; // ['/albums'], ['/photos'], ['albums', id]
  nextLink: string;
  private pressingCtrlKey: boolean = false;

  private currentPage: string;
  private objectType: string; //photo, album, video, playlist, all
  private params: any;


  @HostListener('document:keydown', ['$event'])
  onKeyDown(ke: KeyboardEvent) {
    this.pressingCtrlKey = this.pressedCtrlKey(ke);
  }

  @HostListener('document:keyup', ['$event'])
  onKeyUp(ke: KeyboardEvent) {
    this.pressingCtrlKey = this.pressedCtrlKey(ke);
  }

  constructor(
    protected resolver: ComponentFactoryResolver,
    protected mediaObjectService: MediaObjectService,
    protected elementRef: ElementRef,
    protected router: Router,
    protected route: ActivatedRoute,
    protected confirmationService: ConfirmationService,
    protected loadingService: LoadingService,
    protected photoService: ZMediaPhotoService,
    protected albumService: ZMediaAlbumService,
    private _location: Location
  ) {

    this.route.queryParams
      .filter(() => this.currentPath != undefined)
      .subscribe(
        (queryParams: any) => {
          this.getObjects(queryParams);
        }
      );
  }


  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.getObjects();

    if(this.MIX_SCREEN.includes(this.currentPath))
      this.changeView('grid'); // Default view should be grid
  }

  getObjects(options?: any) {
    let path = this.currentPath;
    if (this.params) {
      console.log('load object', this.currentPath, this.currentPage);
      this.loadingService.start('#list-photo');
      this.mediaObjectService.getObjects(`photos`, {album: this.params['id']}).subscribe((response: any)=> {
        this.loadingService.stop('#list-photo');
        this.objects = response.data;
        this.nextLink = response.page_metadata.links.next;

      });
      return;
    }


    this.loadingService.start('#list-photo');
    this.mediaObjectService.getObjects(this.currentPath, options).subscribe((response: any)=> {
      this.loadingService.stop('#list-photo');
      this.objects = response.data;
      this.nextLink = response.page_metadata.links.next;

    });
  }

  getMoreObjects() {
    // this.loadingService.start('#list-photo');
    if (this.nextLink != null) { // if there are more objects
      // this.mediaObjectService.getObjects(this.nextLink).subscribe((response: any)=> {
      this.mediaObjectService.loadMore(this.nextLink).subscribe((response: any)=> {
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
        this.events.emit(options);
        break;
    }
  }

  changeView(viewOption: string) {
    console.log(viewOption);
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
      // TODO  check here
      // this.sort(event.data);
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

  sort(data: any) {

  }

  // considering moving doAction into list-media
  doAction(event: any) {

    console.log('event in list media::', event);
    switch (event.action) {
      case 'uploadPhoto':
        this.upload();
        break;
      case 'showUploadedPhotos':
        this.showUploadedPhotos(event.data);
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

  favourite() {

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
    if(this.currentPath == 'photos') {

    } else if(this.currentPath == 'albums') {
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
        .subscribe((res: any) => {
            // stop loading
            console.log(res);
            this.loadingService.stop();
          },
          (error: any) => {
            // stop loading
            this.loadingService.stop();
            console.log(error);
          }
        );
    }

    console.log('call edit info method here');
  }

  delete() {
    console.log('testing...... detete:', this.selectedObjects);
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
    this.router.navigate(['/albums', this.selectedObjects[0].id]);
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
      $('.row-img .photo-box-img').removeClass('selected');
      $('#photo-box-img-' + item.id).addClass('selected');
      this.selectedObjects.length = 0;
      this.selectedObjects.push(item);
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
}
