import {Component, AfterViewInit, OnInit, ElementRef} from '@angular/core';
import {ROUTER_DIRECTIVES, ActivatedRoute} from '@angular/router';
import {ToastUploadingComponent} from './toast-upload/index';
import {ZPictureBarComponent} from './shared/bar-control.component';
import {PhotoService} from '../../shared/services/photo/photo.service';
import {ZPhotoComponent} from './+photo/photo.component';
import {ZAlbumComponent} from './+album/album.component';
import {AddedToAlbumToastComponent} from './+photo/toast/added-to-album-toast.component';
import {ZPictureFormAddToAlbumComponent} from './shared/form/form-add-to-album.component';
import {ZPictureFormCreateAlbumComponent} from './shared/form/form-create-album.component';
import {FictureSharedData} from '../../shared/services/photo/ficturesharedata.service';


import {ZPictureSharingComponent} from './shared/form-sharing.component';
import {ZPictureTaggingComponent} from './shared/form-tagging.component';
import {ZPhotoEditComponent} from './shared/photo-edit.component';

import {
  ApiBaseService,
  DialogService,
  LoadingService,
  ToastsService
} from '../../shared/index';
import {ZAlbumDetailComponent} from './+album/album-detail.component';

declare var $: any;
declare var _: any;


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
    AddedToAlbumToastComponent,
    ZPictureFormAddToAlbumComponent,
    ZPictureFormCreateAlbumComponent,
    ZPictureSharingComponent,
    ZPictureTaggingComponent,
    ZAlbumDetailComponent,
    ZPhotoEditComponent
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
  isAlbumDetail: boolean;

  showAddedtoAlbumToast: boolean = false;
  photoCount: number;
  showAddtoAlbumForm: boolean = false;
  album: number;
  photos: Array<number>;
  showCreateAlbum: boolean = false;
  albumName: string;
  resetSelected: boolean = false;

  hasFavourite: boolean = false;

  /**
   * Modal
   */
  modalShare: boolean = false;
  modalTag: boolean = false;
  modalPreview: boolean = false;
  modalEdit: boolean = false;

  /**
   * Items is array of Photos, Album, Video, etc.
   */
  items: Array<any>;
  selectedItems: Array<any>;
  hasSelectedItem: boolean;
  hasMultiSelectedItem: boolean;
  hasUploadedItem: boolean;
  // deletedItems: Array<any>;


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
    this.hasUploadedItem = false;
    this.selectedItems = new Array<any>();
    this.photos = new Array<number>();

    this.sub = this.route.params.subscribe(params => {
      this.category = params['category'];
      if (this.category == 'photo' || this.category == undefined) {
        this.isPhoto = true;
        this.isAlbum = false;
        this.isVideo = false;
        this.isAlbumDetail = false;
      } else if (this.category == 'album' && params['id'] == null) {
        this.isAlbum = true;
        this.isPhoto = false;
        this.isVideo = false;
      } else if (this.category == 'album' && params['id'] != null) {
        this.isAlbumDetail = true;
        this.isPhoto = false;
        this.isVideo = false;
        this.isAlbum = false;
      } else if (this.category == 'video') {
        this.isVideo = true;
        this.isPhoto = false;
        this.isAlbum = false;
        this.isAlbumDetail = false;
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
    this.hasUploadedItem = false;
  }

  onDrop(event: any) {
    $('body').removeClass('drag-active');
    event.stopPropagation();
    event.preventDefault();
    this.files = event.dataTransfer.files;
    if (this.files.length == 0) return;
    this.hasUploadedItem = false;
  }

  dragleave() {
    $('body').removeClass('drag-active');
    this.dragging_leave = true;
  }

  dragover(event: any) {
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

  // Add Photo to Album modal
  onModalHideAlbum(e: boolean) {
    this.showAddtoAlbumForm = e;
    this.addPhotosToAlbumAction();
  }

  addPhotosToAlbumAction() {
    console.log(this.photos.length, this.fictureSharedData.albumId);
    if (this.photos.length != 0 && this.fictureSharedData.albumId) {
      let res = this.photoService.addPhotosToAlbum(this.photos, this.fictureSharedData.albumId);
      if (res) {
        res.subscribe((result: any) => {
            this.showAddedtoAlbumToast = true;
            this.photoCount = this.photos.length;
            this.albumName = this.fictureSharedData.albumName;
            // Reset Data
            this.photos = new Array<number>();
            this.fictureSharedData.albumId = null;
            this.resetSelectedAction();
          },
          error => {
            console.log('error', error);
          }
        );
      }
    }
  }

  resetSelectedAction() {
    if (this.resetSelected) {
      this.resetSelected = false;
    } else {
      this.resetSelected = true;
    }
  }

  photoEvent(photos: Array<number>) {
    this.photos = photos;
  }

  onCreateNewAlbum($event: boolean) {
    this.showAddtoAlbumForm = false;
    this.showCreateAlbum = true;
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
    this.hasUploadedItem = false;
    if (event) {
      let body = JSON.stringify({
        ids: this.selectedItems,
        isToggle: this.hasFavourite
      });
      this.loadingService.start();
      this.apiBaseService.post(`zone/photos/favourite`, body)
        .subscribe((result: any) => {
            // stop loading
            this.hasUploadedItem = true;
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
    this.modalEdit = event;
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
    this.hasUploadedItem = false;
    if (event) {
      this.dialogService.activate('Are you sure to delete ' + this.selectedItems.length + ' item' + (this.selectedItems.length > 1 ? 's' : '') + ' ?', 'Confirmation', 'Yes', 'No').then((responseOK) => {
        if (responseOK) {
          let body = JSON.stringify({ids: this.selectedItems});
          this.loadingService.start();
          this.apiBaseService.post(`zone/photos/delete`, body)
            .subscribe((result: any) => {
                // stop loading
                this.hasUploadedItem = true;
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

  download(event: any) {
    if (event) {
      let body = JSON.stringify({ids: this.selectedItems});
      this.loadingService.start();
      this.apiBaseService.post(`zone/photos/download`, body)
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
  }

  add(event: any) {
    this.showAddtoAlbumForm = true;
    // if (event) {
    // let body = JSON.stringify({ids: this.selectedItems});
    // this.loadingService.start();
    // this.apiBaseService.post(`zone/photos/download`, body)
    //   .subscribe((result: any) => {
    //       // stop loading
    //       this.loadingService.stop();
    //       //this.toastsService.success(result.message);
    //     },
    //     error => {
    //       // stop loading
    //       this.loadingService.stop();
    //       //this.toastsService.danger(error);
    //       console.log(error);
    //     }
    //   );
    // }
  }

  edit(event: any) {
    this.modalEdit = true;
  }

  viewInfo(event: any) {
    console.log('edit event');
  }

  changedSelectedItems(items: Array<any>) {
    this.selectedItems = items;
    this.hasSelectedItem = (items.length > 0) ? true : false;
    if (this.category == 'photo') {
      this.photos = this.selectedItems;
    }
    this.hasMultiSelectedItem = (items.length > 1) ? true : false;
  }


  changedSelectedItemsFull(items: Array<any>): void {
    if (_.find(items, {'favorite': false})) {
      this.hasFavourite = false;
    } else {
      this.hasFavourite = true;
    }
  }

  viewChanged(view: string) {
    this.pageView = view;
  }

  onHideCreateAlbum(e: boolean) {
    this.showCreateAlbum = e;
    this.addPhotosToAlbumAction();
  }

  uploadedItem(hasItem: boolean) {
    this.hasUploadedItem = hasItem;
  }

}
