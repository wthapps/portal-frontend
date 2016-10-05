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

import {
  ApiBaseService,
  UserService,
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
  isAlbumDetail:boolean;

  showAddedtoAlbumToast: boolean = false;
  photoCount: number;
  showAddtoAlbumForm: boolean = false;
  album: number;
  photos: Array<number>;
  showCreateAlbum: boolean = false;
  albumName:string;
  resetSelected:boolean = false;

  /**
   * Items is array of Photos, Album, Video, etc.
   */
  items: Array<any>;
  selectedItems: Array<any>;
  hasSelectedItem: boolean;


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
    this.photos = new Array<number>();

    this.sub = this.route.params.subscribe(params => {
      console.log(params);
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

  // Add Photo to Album modal
  onModalHide(e: boolean) {
    this.showAddtoAlbumForm = e;
    this.addPhotosToAlbumAction();
  }

  addPhotosToAlbumAction () {
    console.log(this.photos.length, this.fictureSharedData.albumId);
    if (this.photos.length != 0 && this.fictureSharedData.albumId) {
      let res = this.photoService.addPhotosToAlbum(this.photos, this.fictureSharedData.albumId);
      if (res) {
        res.subscribe((result: any) => {
            console.log(result);
            this.showAddedtoAlbumToast = true;
            this.photoCount = this.photos.length;
            this.albumName = this.fictureSharedData.albumName;
            // Reset Data
            this.photos = new Array<number>();
            this.fictureSharedData.albumId = null;
            this.resetSelectedAction();
          },
          error => {
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

  onCreateNewAlbum($event:boolean) {
    this.showAddtoAlbumForm = false;
    this.showCreateAlbum = true;
  }

  /**
   *
   * @param event
   */

  preview(event: any) {

  }

  share(event: any) {

  }

  addFavourite(event: any) {

  }

  tag(event: any) {

  }

  delete(event: any) {
    if (event) {
      this.dialogService.activate('Are you sure to delete ' + this.selectedItems.length + ' item' + (this.selectedItems.length > 1 ? 's' : '') + ' ?', 'Confirmation', 'Yes', 'No').then((responseOK) => {
        if (responseOK) {
          let body = JSON.stringify({ids: this.selectedItems});
          this.loadingService.start();
          this.apiBaseService.post(`zone/photos/delete`, body)
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

  add(event: any){
    this.showAddtoAlbumForm = true;
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

  edit(event: any) {

  }

  viewInfo(event: any) {

  }

  changedSelectedItems(items: Array<any>) {
    this.selectedItems = items;
    this.hasSelectedItem = (items.length > 0) ? true : false;
    if (this.category == "photo") {
      this.photos = this.selectedItems;
    }
  }

  viewChanged(view: string) {
    this.pageView = view;
  }

  onHideCreateAlbum(e:boolean) {
    this.showCreateAlbum = e;
    this.addPhotosToAlbumAction();
  }
}
