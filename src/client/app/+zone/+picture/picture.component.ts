import {Component, AfterViewInit, OnInit, ElementRef} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {ToastUploadingComponent} from './toast-upload/index';
import {ApiBaseService} from "../../shared/services/apibase.service";
import {UserService} from "../../shared/services/user.service";
import {ZPictureBarComponent} from './shared/bar-control.component';
import {PhotoService} from "../../shared/services/photo/photo.service";
// import {LoadingService} from "../../../../../dist/tmp/app/partials/loading/loading.service";
// import {ToastsService} from "../../../../../dist/tmp/app/partials/toast/toast-message.service";

declare var $: any;


@Component({
  moduleId: module.id,
  selector: 'page-zone-picture',
  templateUrl: 'picture.component.html',
  providers: [PhotoService],
  directives: [
    ROUTER_DIRECTIVES,
    ToastUploadingComponent,
    ZPictureBarComponent
  ]
})

export class ZPictureComponent implements OnInit {
  photo_input_element: any = null;
  files: any;
  dragging_over: boolean;
  dragging_leave: boolean;
  dragging_enter: boolean;
  // test_img: any;

  image_src: string = '';
  step: number = 0;

  pageView: string = 'grid';

  constructor(private element: ElementRef,
              private apiService: ApiBaseService,
              private userService: UserService,
              private photoService: PhotoService) {
  }

  ngOnInit() {
    // this.photo_input_element = document.getElementById('photo_input_element');

    // this.test_img = this.element.nativeElement.querySelector('.img-center');
  }

  ngAfterViewInit() {

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

  viewChanged(event: any) {
    console.log("changed view", event);
    this.pageView = event;

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

  onAlbumAndPhotos(event:any) {
    console.log(event);
    this.photoService.addPhotosToAlbum(event.photoIds, event.albumId);
  }
}
