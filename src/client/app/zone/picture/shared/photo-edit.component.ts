import {Component, OnChanges, Input, Output, EventEmitter, AfterViewInit} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';
import {Photo} from '../../../shared/models/photo.model';

declare var $: any;
declare var _: any;
declare var cropper: any;

@Component({
  moduleId: module.id,
  selector: 'zone-photo-edit',
  templateUrl: 'photo-edit.component.html',
  directives: [
    ROUTER_DIRECTIVES
  ]
})

export class ZPhotoEditComponent implements OnChanges, AfterViewInit {

  @Input() showModal: boolean;
  @Input() data: Photo;
  @Output() modalHide: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output() imageClicked: EventEmitter<string> = new EventEmitter<string>();

  imgOne: string = 'https://fengyuanchen.github.io/cropper/v0.7.9/img/picture-1.jpg';

  ngAfterViewInit(): void {
    this.reInitPhoto();
  }

  ngOnChanges(): void {
    if (this.showModal) {
      $('body').addClass('fixed-hidden').css('padding-right', this.getBarwidth());
      $('#photo-box-edit').addClass('active');
    }
    if (this.data) {
      this.imgOne = this.data.url;
    }
  }

  hideModal(): void {
    this.showModal = false;
    $('body').removeClass('fixed-hidden').css('padding-right', 0);
    $('#photo-box-edit').removeClass('active');
    this.modalHide.emit(false);
  }


  private reInitPhoto(): void {
    // Define variables
    let _this = this;

    let elImage = $('#photo-detail-img');
    let cropperRotateLeft = $('#photo-detail-rotate-left');
    let cropperRotateRigth = $('#photo-detail-rotate-right');
    let cropperCrop = $('#photo-detail-crop');
    let cropperZoomIn = $('#photo-detail-zoom-in');
    let cropperZoomOut = $('#photo-detail-zoom-out');
    let cropperReset = $('#photo-detail-reset');

    // initialize cropper
    let myCropOptions = {
      viewMode: 3
      //, aspectRatio: 1 / 1
      , dragMode: 'move'
      //, autoCropArea: 0.8
      //, restore: false
      //, modal: false
      , guides: false
      , highlight: false
      //, cropBoxMovable: true
      //, cropBoxResizable: true
      , autoCrop: false
      , checkCrossOrigin: false
      , built: function () {
        $(this).cropper('clear');
      }
    };

    elImage.cropper(myCropOptions);

    // listener for 'action' button in modal
    cropperRotateLeft.on('click', function () {
      elImage.cropper('rotate', -90);
    });
    cropperRotateRigth.on('click', function () {
      elImage.cropper('rotate', 90);
    });
    cropperCrop.on('click', function () {
      elImage.cropper("setDragMode", "crop");
    });
    cropperZoomIn.on('click', function () {
      elImage.cropper("zoom", 0.1);
    });
    cropperZoomOut.on('click', function () {
      elImage.cropper("zoom", -0.1);
    });
    cropperReset.on('click', function () {
      elImage.cropper("reset");
    });
  }

  private getBarwidth(): number {
    // Create the measurement node
    let scrollDiv = document.createElement("div");
    scrollDiv.className = "scrollbar-measure";
    document.body.appendChild(scrollDiv);

    // Get the scrollbar width
    let scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    //console.warn(scrollbarWidth); // Mac:  15

    // Delete the DIV
    document.body.removeChild(scrollDiv);
    return scrollbarWidth;
  }
}
