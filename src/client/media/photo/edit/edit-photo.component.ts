import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common';

import { Photo } from '../../../core/shared/models/photo.model';
import { ZMediaPhotoService } from '../photo.service';
import { ActivatedRoute, Params } from '@angular/router';

declare var $: any;
declare var Cropper: any;

@Component({
  moduleId: module.id,
  selector: 'z-media-photo-edit',
  templateUrl: 'edit-photo.component.html',
  styleUrls: ['edit-photo.component.css']
})
export class ZMediaPhotoEditComponent implements OnInit, AfterViewInit {
  @Input() data: Photo = null;

  loadingImg: boolean = true;
  imgUrl: string = 'assets/images/zone/media/photo-edit-default.png';
  img: any = null;
  imgType: string = 'jpg';

  hasSave: boolean = true;

  myCropOptions: any = {
    viewMode: 2,
    dragMode: 'move',
    autoCropArea: 1,
    autoCrop: false
  };

  constructor(private photoService: ZMediaPhotoService,
              private route: ActivatedRoute,
              private location: Location) {
  }

  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.getPhoto(params['id']);
    });
  }

  ngAfterViewInit() {
    this.reInitPhoto();
  }

  onBack() {
    this.location.back();
  }

  getPhoto(id: any) {
    this.photoService.getPhoto(id).subscribe(
      (res: any)=> {
        this.data = res.data;
        this.imgUrl = res.data.url;
        this.imgType = res.data.extension;
        // this.img.cropper('reset', true).cropper('replace', res.data.url);
        this.img.cropper('destroy').attr('src', res.data.url).cropper(this.myCropOptions).cropper('clear');
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
    this.hasSave = false;
  }

  cropperZoomIn() {
    this.img.cropper('zoom', 0.1);
  }

  cropperZoomOut() {
    this.img.cropper('zoom', -0.1);
  }

  cropperReset() {
    // this.img.cropper('reset');
    this.img.cropper('destroy').attr('src', this.data.url).cropper(this.myCropOptions).cropper('clear');
  }

  cropperDone() {
    let result = this.img.cropper('getCroppedCanvas').toDataURL();
    this.img.cropper('destroy').attr('src', result).cropper(this.myCropOptions).cropper('clear');

    this.hasSave = true;
  }

  cropperSave() {
    let _this = this;

    //http://codepen.io/anon/pen/PZxWez
    //https://gist.github.com/maria-p/8633b51f629ea8dbd27e
    // transform cropper dataURI output to a Blob which Dropzone accepts
    function dataURItoBlob(dataURI: any) {
      var byteString = atob(dataURI.split(',')[1]);
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      return new Blob([ab], {type: `image/${_this.imgType}`});
    }

    var cachedFilename = this.data.name;

    // get cropped image data
    var blob = this.img.cropper('getCroppedCanvas').toDataURL();

    console.log(blob);

    // transform it to Blob object
    var newFile: any = dataURItoBlob(blob);
    // set 'cropped to true' (so that we don't get to that listener again)
    newFile.cropped = true;
    // assign original filename
    newFile.name = cachedFilename;

    console.log(newFile);
  }


  private reInitPhoto(): void {
    // Define variables
    let elImage = $('#photo-detail-img');
    elImage.cropper();
    this.img = elImage;
  }
}
