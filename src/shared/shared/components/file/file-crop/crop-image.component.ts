import { Component, AfterViewInit, Output, EventEmitter, ViewChild } from '@angular/core';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { Constants } from '../../../../constant/config/constants';
import * as Cropper  from 'cropperjs';


// declare var $: any;

@Component({
  selector: 'wth-crop-image',
  templateUrl: 'crop-image.component.html',
  styleUrls: ['crop-image.component.scss']
})

export class CropImageComponent implements AfterViewInit {
  @ViewChild('modal') modal: ModalComponent;
  @Output() changeImageEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() doneEvent: EventEmitter<string> = new EventEmitter<string>();

  curImage: string = "";
  cropper: any = null;

  readonly DEFAULT_IMG: string = Constants.img.avatar;
  readonly DEFAULT_CROP_OPTION: any = {
    viewMode: 3
    , aspectRatio: 1 / 1
    , dragMode: 'move'
    , autoCropArea: 0.8
    , restore: false
    //, modal: false
    , guides: false
    , highlight: false
    , cropBoxMovable: true
    , cropBoxResizable: true
    , minContainerWidth: 200
    , minContainerHeight: 200
  };

  ngAfterViewInit(): void {

  }

  open(file?: any) {
    if(file !== undefined) {
      this.curImage = file;
      this.initCropper();
    }

    setTimeout(() => {
      this.modal.open();
    }, 200);

  }

  initCropper() {
    this.clearCropper();
    if (this.cropper == null) {
      let image = document.getElementById('image');
      this.cropper = new Cropper(image, {
        ...this.DEFAULT_CROP_OPTION,
      });
    }
    this.cropper.replace(this.curImage);
  }


  rotateCropper(leftDirect: boolean) {
    this.cropper.rotate(leftDirect ? -90 : 90);
  }

  clearCropper() {
    if(this.cropper !== null) {
      this.cropper.destroy();
      this.cropper = null;
    }
    // $('.cropper-container').remove();
  }

  done() {
    let editedData = this.cropper.getCroppedCanvas().toDataURL(this.curImage);
    this.doneEvent.emit(editedData);
    this.clearCropper();
    this.modal.close();
  }

  changeImage() {
    this.changeImageEvent.emit(null);
    this.clearCropper();
    this.modal.close();
  }
}
