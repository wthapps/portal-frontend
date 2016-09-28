import {Component, AfterViewInit, OnInit, ElementRef} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {ToastUploadingComponent} from './toast-upload/index';
import {ApiBaseService} from "../../shared/services/apibase.service";
import {UserService} from "../../shared/services/user.service";
// import {LoadingService} from "../../../../../dist/tmp/app/partials/loading/loading.service";
// import {ToastsService} from "../../../../../dist/tmp/app/partials/toast/toast-message.service";

declare var $: any;


@Component({
  moduleId: module.id,
  selector: 'page-zone-picture',
  templateUrl: 'picture.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    ToastUploadingComponent
  ]
})

export class ZPictureComponent implements AfterViewInit, OnInit {
  photo_input_element: any = null;
  files: any;
  dragging_over: boolean;
  dragging_leave: boolean;
  dragging_enter: boolean;
  // test_img: any;

  image_src: string = '';
  step: number = 0;

  constructor(private element: ElementRef,
              private apiService: ApiBaseService,
              private userService: UserService) {
  }

  ngOnInit() {
    // this.photo_input_element = document.getElementById('photo_input_element');
    this.photo_input_element = this.element.nativeElement.querySelector('#photo_input_element');
    // this.test_img = this.element.nativeElement.querySelector('.img-center');
  }

  openFileWindow(element_id: string, event: any) {
    event.preventDefault();
    this.photo_input_element.value = null;
    this.photo_input_element.click();
  }

  handleFileUpload(event) {
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

}
