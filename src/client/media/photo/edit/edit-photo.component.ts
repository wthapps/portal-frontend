import { Component, Input, OnInit, AfterViewInit } from '@angular/core';

import { Photo } from '../../../core/shared/models/photo.model';
import { ZMediaPhotoService } from '../photo.service';
import { ActivatedRoute, Params } from '@angular/router';

declare var $: any;
declare var Cropper: any;

@Component({
  moduleId: module.id,
  selector: 'z-media-photo-edit',
  templateUrl: 'edit-photo.component.html'
})
export class ZMediaPhotoEditComponent implements OnInit, AfterViewInit {
  @Input() data: Photo = null;

  loadingImg: boolean = true;

  constructor(private photoService: ZMediaPhotoService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.getPhoto(params['id']);
    });
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit');
    this.reInitPhoto();
  }

  getPhoto(id: any) {
    this.photoService.getPhoto(id).subscribe(
      (res: any)=> {
        this.data = res.data;
      }
    );
  }

  showLoading() {
    this.loadingImg = false;
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
}
