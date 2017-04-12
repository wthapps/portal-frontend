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
  imgUrl: string = 'assets/images/zone/media/photo-edit-default.png';
  img: any = null;

  constructor(private photoService: ZMediaPhotoService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.getPhoto(params['id']);
    });
  }

  ngAfterViewInit() {
    this.reInitPhoto();
  }

  getPhoto(id: any) {
    this.photoService.getPhoto(id).subscribe(
      (res: any)=> {
        this.data = res.data;
        this.imgUrl = res.data.url;
        // this.img.cropper('reset', true).cropper('replace', res.data.url);
        this.img.cropper('destroy').attr('src', res.data.url).cropper();
      }
    );
  }

  showLoading(e: any) {
    this.loadingImg = false;
  }

  cropperRotateLeft() {
    this.img.cropper('rotate', -90);
  }

  cropperRotateRigth() {
    this.img.cropper('rotate', 90);
  }

  cropperCrop() {
    this.img.cropper('setDragMode', 'crop');
  }

  cropperZoomIn() {
    this.img.cropper('zoom', 0.1);
  }

  cropperZoomOut() {
    this.img.cropper('zoom', -0.1);
  }

  cropperReset() {
    this.img.cropper('reset');
  }


  private reInitPhoto(): void {
    // Define variables
    let _this = this;

    let elImage = $('#photo-detail-img');

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
      , checkCrossOrigin: true
      , built: function () {
        $(this).cropper('clear');
      }
    };

    elImage.cropper(myCropOptions);

    this.img = elImage;
  }
}
