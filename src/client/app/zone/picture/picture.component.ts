import { Component, ViewChild, OnChanges } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { BaseMediaComponent } from '../shared/media/base-media.component';
import { ZonePhotoComponent } from './photo/photo.component';
import { ZoneVideoComponent } from './video/video.component';
import { MediaType } from '../../shared/config/constants';
import {
  ApiBaseService,
  ToastsService,
  LoadingService,
  ConfirmationService

} from '../../shared/index';
import { ZAlbumComponent } from "./album/album.component";
import { ZAlbumDetailComponent } from "./album/album-detail.component";
import {FormTextElement} from "../../shared/models/form/form-text-element.model";
import {FormBase} from "../../shared/models/form/form-base.model";

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'z-picture',
  templateUrl: 'picture.component.html',
  styleUrls: ['picture.component.css']
})

export class ZPictureComponent implements OnChanges {

  @ViewChild('media') baseMedia: BaseMediaComponent;

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
  viewPicture: any;
  viewPictureType: any;

  showAddedtoAlbumToast: boolean = false;
  photoCount: number;
  showAddtoAlbumForm: boolean = false;
  photos: Array<number>;
  onePhotoEdit: any;
  showCreateAlbumForm: boolean = false;
  album: any;
  resetSelected: boolean = false;
  showCreatedAlbumToast: boolean = false;

  hasFavourite: boolean = false;
  isLoading: boolean = false;
  paramId: number;

  /**
   * Modal
   */
  modalShare: boolean = false;
  modalTag: boolean = false;
  modalPreview: boolean = false;
  modalEdit: boolean = false;
  modalViewInfo: boolean = false;


  /**
   * Items is array of Photos, Album, Video, etc.
   */
  items: Array<any>;
  selectedItems: Array<any>;
  hasSelectedItem: boolean;
  hasMultiSelectedItem: boolean;
  hasUploadedItem: boolean;
  // deletedItems: Array<any>;
  mediaType: any;

  // Album
  formData: FormBase;

  constructor(// private element: ElementRef,
    //           private photoService: PhotoService,
    //           private albumService: AlbumService,
    private route: ActivatedRoute,
    private apiService: ApiBaseService,
    private toastsService: ToastsService,
    private loadingService: LoadingService,
    private confirmationService: ConfirmationService
    //           private dialogService: DialogService,
    //           private loadingService: LoadingService,
    //           private toastsService: ToastsService

  ) {
    this.dragleave();
  }

  ngOnInit() {
    this.hasUploadedItem = false;
    this.selectedItems = new Array<any>();
    this.photos = new Array<number>();
    this.mediaType = MediaType;

    this.sub = this.route.params.subscribe(params => {
      this.category = params['category'];
      if (params['id']) {
        this.category += 'Detail';
      }
      this.collectView(params);
    });
  }

  ngOnChanges(changes: any) {

  }


  collectView(params: any) {
    switch (this.category) {
      case MediaType.photo:
        this.baseMedia = new ZonePhotoComponent(this.apiService, this.toastsService, this.loadingService, this.confirmationService);
        break;
      case MediaType.video:
        this.baseMedia = new ZoneVideoComponent(this.apiService);
        break;
      case MediaType.album:
        this.baseMedia = new ZAlbumComponent(this.apiService, this.toastsService, this.loadingService, this.confirmationService);
        break;
      case MediaType.albumDetail:
        this.baseMedia = new ZAlbumDetailComponent();
        break;
    }
    // debugger;
  }

  ngAfterViewInit() {
    let _thisPicture = this;
    $('body').bind('dragover', _thisPicture.dragover);

    // only allow drag from outside the browser
    $('body').on('dragstart', function (event: any) {
      event.preventDefault();
    });
  }

  openFileWindow(event: any) {
    // event.preventDefault();
    // this.photo_input_element = this.element.nativeElement.querySelector('#photo_input_element');
    // this.photo_input_element.value = null;
    // this.photo_input_element.click();
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
    // this.album = this.albumService.getAlbum();
    // if (this.photos.length != 0 && this.albumService.getAlbum()) {
    //   this.photoService.addPhotosToAlbum(this.photos, this.album.id, (result: any) => {
    //     this.showAddedtoAlbumToast = true;
    //     this.photoCount = this.photos.length;
    //     // Reset Data
    //     this.photos = new Array<number>();
    //     this.albumService.clearAlbum();
    //     this.resetSelectedAction();
    //   });
    // } else if (this.albumService.getAlbum()) {
    //   this.showCreatedAlbumToast = true;
    //   this.albumService.clearAlbum();
    // }
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
    // this.hasUploadedItem = false;
    // if (event) {
    //   let body = JSON.stringify({
    //     ids: this.selectedItems,
    //     isToggle: this.hasFavourite
    //   });
    //   this.loadingService.start();
    //   this.apiBaseService.post(`zone/photos/favourite`, body)
    //     .subscribe((result: any) => {
    //         // stop loading
    //         this.hasUploadedItem = true;
    //         this.loadingService.stop();
    //         //this.toastsService.success(result.message);
    //       },
    //       error => {
    //         // stop loading
    //         this.loadingService.stop();
    //         //this.toastsService.danger(error);
    //         console.log(error);
    //       }
    //     );
    // }
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
    this.modalViewInfo = event;
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
    // this.hasUploadedItem = false;
    // if (event) {
    //   this.dialogService.activate('Are you sure to delete ' + this.selectedItems.length + ' item' + (this.selectedItems.length > 1 ? 's' : '') + ' ?', 'Confirmation', 'Yes', 'No').then((responseOK) => {
    //     if (responseOK) {
    //       let body = JSON.stringify({ids: this.selectedItems});
    //       this.loadingService.start();
    //       this.apiBaseService.post(`zone/photos/delete`, body)
    //         .subscribe((result: any) => {
    //             // stop loading
    //             this.hasUploadedItem = true;
    //             this.loadingService.stop();
    //
    //             //this.toastsService.success(result.message);
    //           },
    //           error => {
    //             // stop loading
    //             this.loadingService.stop();
    //             //this.toastsService.danger(error);
    //             console.log(error);
    //           }
    //         );
    //     }
    //   });
    // }
  }

  download(event: any) {
    // if (event) {
    //   let body = JSON.stringify({ids: this.selectedItems});
    //   this.loadingService.start();
    //   this.apiBaseService.post(`zone/photos/download`, body)
    //     .subscribe((result: any) => {
    //         // stop loading
    //         this.loadingService.stop();
    //         //this.toastsService.success(result.message);
    //       },
    //       error => {
    //         // stop loading
    //         this.loadingService.stop();
    //         //this.toastsService.danger(error);
    //         console.log(error);
    //       }
    //     );
    // }
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
    this.modalViewInfo = true;
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

    this.onePhotoEdit = items[0];

  }

  viewChanged(view: string) {

    // this.baseMedia.changeView(view);
    console.log('media. ', this.baseMedia);
    this.pageView = view;
  }

  onHideCreateAlbum(e: boolean) {
    this.showCreateAlbumForm = e;
    this.addPhotosToAlbumAction();
  }

  uploadedItem(hasItem: boolean) {
    console.log('finished upload');
    this.baseMedia.needToReload = hasItem;
    this.baseMedia.loadItems(this.baseMedia.currentPage);
  }

}
