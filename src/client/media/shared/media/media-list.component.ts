import {
  Component, Input, Output, EventEmitter, AfterViewInit, OnInit, HostListener, ElementRef, ViewChild,
  ViewContainerRef, ComponentFactoryResolver
} from '@angular/core';
import { Router } from '@angular/router';


import { MediaObjectService } from '../container/media-object.service';
import { Constants } from '../../../core/shared/config/constants';
import { LoadingService } from '../../../core/partials/loading/loading.service';
import { BaseObjectEditNameModalComponent } from '../modal/base-object-edit-name-modal.component';
import { PhotoEditModalComponent } from '../../photo/form/photo-edit-modal.component';
import { AlbumCreateModalComponent } from '../modal/album-create-modal.component';
import { AlbumEditModalComponent } from '../modal/album-edit-modal.component';
import { ZMediaSharingComponent } from '../sharing/sharing.component';
import { ZMediaTaggingComponent } from '../tagging/tagging.component';
import { AddToAlbumModalComponent } from '../modal/add-to-album-modal.component';
import { ConfirmationService } from 'primeng/components/common/api';
import { PhotoDetailModalComponent } from '../modal/photo-detail-modal.component';

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
    PhotoDetailModalComponent
  ]
})

export class MediaListComponent implements OnInit, AfterViewInit {
  @Input() selectedObjects: Array<any> = new Array<any>();
  // @Input() type: string = 'photo';
  // @Input() objects: any;

  @Output() events: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('modalContainer', { read: ViewContainerRef }) modalContainer: ViewContainerRef;


  readonly LIST_TYPE = { photo: 'photo', album: 'album', mix: 'mix'};
  readonly TYPE_MAPPING: any = Constants.mediaListDetailTypeMapping;

  modalComponent: any;
  modal: any;

  sliderViewNumber: number = Constants.mediaSliderViewNumber.default;
  viewOption: string = 'grid';

  groupBy: string;
  objects: Array<any> = new Array<any>();
  currentPath: string; //photos, albums, videos, playlist, share-with-me, favourites
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

  // @HostListener('document:click', ['$event'])
  // clickout(event: any) {
  //
  //   // if clicking on menu
  //   if ($(event.target).hasClass('fa')) return;
  //
  //   // if clicking outside item
  //   if(this.elementRef.nativeElement.contains(event.target)) return;
  //
  //   if (this.selectedObjects.length > 0) {
  //     _.forEach(this.selectedObjects, (item: any) => {
  //       if (_.some(this.selectedObjects, ['id', item.id])) {
  //         $('#photo-box-img-' + item.id).removeClass('selected');
  //       }
  //     });
  //
  //     // remove all selected objects
  //     this.selectedObjects.length = 0;
  //     this.onAction({action: 'deselect', params: {selectedObjects: this.selectedObjects}});
  //   }
  // }


  constructor(
    protected resolver: ComponentFactoryResolver,
    protected mediaObjectService: MediaObjectService,
    protected elementRef: ElementRef,
    protected loadingService: LoadingService,
    protected router: Router,
    protected confirmationService: ConfirmationService
  ) {

  }


  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.getObjects();
  }

  getObjects(options?: any) {

    let path = this.currentPath;
    if(this.params) {
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
      this.mediaObjectService.getObjects(this.nextLink).subscribe((response: any)=> {
        // this.loadingService.stop('#list-photo');
        this.objects.push(response.data);
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
    switch(options.action) {
      case 'select':
      case 'deselect':
      case 'goBack':
        this.events.emit(options);
        break;
    }
  }

  changeView(viewOption: string) {
    this.viewOption = viewOption;
  }

  actionSortbar(event: any) {
    if (event.action == 'slider') {
      this.sliderViewNumber = event.number;
    }
  }

  actionItem(ev: any) {
    if (ev.action == 'group') {
      this.groupBy = ev.data;
        return;
    }

    console.log('raise event:', ev);

    this.events.emit(ev);
  }

  // considering moving doAction into list-media
  doAction(event: any) {

    console.log('event in list media::', event);
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
      case 'goBack':
        this.goBack();
        break;

      // open all of modal
      case 'openModal':
        this.openModal(event.params.modalName);
        break;
    }
  }

  upload() {
    // this.loadModalComponent(MediaUloaderComponent);

  }

  preview() {
    // open modal
    this.loadModalComponent(PhotoDetailModalComponent);
    this.modal.open({show: true, showDetails: false, selectedObjects: this.selectedObjects});
    this.modal.event.subscribe((event: any) => {
      this.doAction(event);
    });
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
    // this.loadModalComponent(ZMediaPhotoDetailComponent);
    // this.modal.open({show: true, showDetails: true, selectedObjects: this.selectedObjects});
  }

  download() {

  }

  edit() {
    if(this.currentPath == 'photos') {

    } else if(this.currentPath == 'albums') {
      this.loadModalComponent(AlbumEditModalComponent);
      this.modal.open();
    }

  }

  editName(selectedObject: any) {
    console.log('call edit name method here:');
    // this.loadModalComponent(BaseObjectEditNameModalComponent);
    // this.modal.open();
  }

  editInfo(selectedObject: any) {
    if(this.currentPath == 'photos') {


    } else if(this.currentPath == 'albums') {
      // this.loadModalComponent(AlbumEditModalComponent);
      // this.modal.open();
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

  // changeView(viewOption: string) {
  //
  // }
  //
  goBack() {

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
