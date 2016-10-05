import {Component, AfterViewInit, OnInit, ElementRef} from '@angular/core';
import {ROUTER_DIRECTIVES, ActivatedRoute} from '@angular/router';
import {ToastUploadingComponent} from './toast-upload/index';
import {ZPictureBarComponent} from './shared/bar-control.component';
import {PhotoService} from '../../shared/services/photo/photo.service';
import {ZPhotoComponent} from './+photo/photo.component';
import {ZAlbumComponent} from './+album/album.component';
import {AddedToAlbumToast} from "./+photo/toast/added-to-album-toast.component";
import {ZPictureFormAddToAlbumComponent} from "./shared/form/form-add-to-album.component";
import {ZPictureFormCreateAlbumComponent} from "./shared/form/form-create-album.component";
import {FictureSharedData} from "../../shared/services/photo/ficturesharedata.service";


import {ZPictureSharingComponent} from './shared/form-sharing.component';
import {ZPictureTaggingComponent} from './shared/form-tagging.component';

import {
  ApiBaseService,
  DialogService,
  LoadingService,
  ToastsService
} from "../../shared/index";

declare var $: any;


@Component({
  moduleId: module.id,
  selector: 'page-zone-picture',
  templateUrl: 'picture.component.html',
  providers: [PhotoService, FictureSharedData],
  directives: [
    ROUTER_DIRECTIVES,
    ToastUploadingComponent,
    ZPictureBarComponent,
    ZPhotoComponent,
    ZAlbumComponent,
    AddedToAlbumToast,
    ZPictureFormAddToAlbumComponent,
    ZPictureFormCreateAlbumComponent,
    ZPictureSharingComponent,
    ZPictureTaggingComponent
  ]
})

export class ZPictureComponent implements OnInit, AfterViewInit {
  photo_input_element: any = null;
  files: any;
  dragging_over: boolean;
  dragging_leave: boolean;
  dragging_enter: boolean;
  // test_img: any;

  image_src: string = '';
  step: number = 0;
  pageView: string = 'grid';
  sub: any;
  category: string;
  isPhoto: boolean;
  isAlbum: boolean;
  isVideo: boolean;


  showAddedtoAlbumToast: boolean = false;
  photoCount: number;
  showAddtoAlbumForm: boolean = false;
  album: number;
  photos: Array<number>;
  showCreateAlbum: boolean = false;

  /**
   * Modal
   */
  modalShare: boolean = false;
  modalTag: boolean = false;
  modalPreview: boolean = false;

  /**
   * Items is array of Photos, Album, Video, etc.
   */
  items: Array<any>;
  selectedItems: Array<any>;
  hasSelectedItem: boolean;
  hasMultiSelectedItem: boolean;

  constructor(private element: ElementRef,
              private photoService: PhotoService,
              private route: ActivatedRoute,
              private apiBaseService: ApiBaseService,
              private dialogService: DialogService,
              private loadingService: LoadingService,
              private toastsService: ToastsService,
              private fictureSharedData: FictureSharedData) {
  }

  ngOnInit() {
    this.isPhoto = false;
    this.isAlbum = false;
    this.isVideo = false;
    this.selectedItems = new Array<any>();

    this.sub = this.route.params.subscribe(params => {
      this.category = params['category'];
      if (this.category == 'photo' || this.category == undefined) {
        this.isPhoto = true;
        this.isAlbum = false;
        this.isVideo = false;
      } else if (this.category == 'album') {
        this.isAlbum = true;
        this.isPhoto = false;
        this.isVideo = false;
      } else if (this.category == 'video') {
        this.isVideo = true;
        this.isPhoto = false;
        this.isAlbum = false;
      }
    });
  }

  ngAfterViewInit() {
    let _thisPicture = this;
    $('body').bind('dragover', _thisPicture.dragover);
  }

  openFileWindow(event: any) {
    event.preventDefault();
    this.photo_input_element = this.element.nativeElement.querySelector('#photo_input_element');
    this.photo_input_element.value = null;
    this.photo_input_element.click();
  }

  handleFileUpload(event: any) {
    this.files = event.target.files;
    if (this.files.length == 0) {
      return;
    }
  }

  onDrop(event: any) {
    $('body').removeClass('drag-active');
    event.stopPropagation();
    event.preventDefault();
    this.files = event.dataTransfer.files;
    if (this.files.length == 0) return;
  }

  dragleave() {
    $('body').removeClass('drag-active');
    this.dragging_leave = true;
  }

  dragover(event) {
    $('body').addClass('drag-active');
    event.preventDefault();
    this.dragging_over = true;
  }

  dragenter() {
    $('body').addClass('drag-active');
    this.dragging_enter = true;
  }

  hideAddedtoAlbumToast(event: boolean) {
    this.showAddedtoAlbumToast = event;
  }

  showModalAddToAlbumEvent(event: boolean) {
    this.showAddtoAlbumForm = true;
  }

  onModalHideAlbum(e: boolean) {
    this.showAddtoAlbumForm = e;
    this.photoService.addPhotosToAlbum(this.photos, this.fictureSharedData.albumId).subscribe((result: any) => {
        this.showAddedtoAlbumToast = true;
        this.photoCount = this.photos.length;
      },
      error => {
      }
    );
  }

  photoEvent(photos: Array<number>) {
    this.photos = photos;

  }

  onCreateNewAlbum($event: boolean) {
    this.showCreateAlbum = true
  }

  /**
   *
   * @param event
   */

  preview(event: any) {
    if (event) {
      this.modalPreview = true;
    }
  }

  share(event: any) {
    if (event) {
      this.modalShare = true;
    }
  }

  addFavourite(event: any) {

  }

  tag(event: any) {
    if (event) {
      this.modalTag = true;
    }
  }

  /**
   * Hide modal
   */
  onModalHide(event: boolean): void {
    this.modalShare = event;
    this.modalTag = event;
    this.modalPreview = event;
  }


  /**
   * This is action from Photo component
   */
  onModalAction(event: string): void {
    if (event == 'tag') {
      this.modalTag = true;
    } else if (event == 'share') {
      this.modalShare = true;
    }
  }

  delete(event: any) {
    if (event) {
      this.dialogService.activate('Are you sure to delete ' + this.selectedItems.length + ' item' + (this.selectedItems.length > 1 ? 's' : '') + ' ?', 'Confirmation', 'Yes', 'No').then((responseOK) => {
        if (responseOK) {
          this.loadingService.start();
          this.apiBaseService.delete(`zone/photos/${this.selectedItems}`)
            .subscribe((result: any) => {
                // stop loading
                this.loadingService.stop();
                //this.toastsService.success(result.message);
              },
              error => {
                // stop loading
                this.loadingService.stop();
                //this.toastsService.danger(error);
                console.log(error);
              }
            );
        }
      });
    }
  }

  add(event: any) {

  }

  download(event: any) {

  }

  edit(event: any) {

  }

  viewInfo(event: any) {

  }

  changedSelectedItems(items: Array<any>) {

    this.selectedItems = items;
    this.hasSelectedItem = (items.length > 0) ? true : false;
    this.hasMultiSelectedItem = (items.length > 1) ? true : false;
    console.log(this.hasMultiSelectedItem);
  }

  viewChanged(view: string) {
    this.pageView = view;
  }
}
