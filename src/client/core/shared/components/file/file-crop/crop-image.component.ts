import { Component, AfterViewInit, Output, EventEmitter, ViewChild } from '@angular/core';

import { ModalComponent } from 'ng2-bs3-modal/components/modal';
import { Constants } from '../../../config/constants';

declare var $: any;
declare var dropzone: any;
declare let Cropper: any;

@Component({
  moduleId: module.id,
  selector: 'wth-crop-image',
  templateUrl: 'crop-image.component.html',
  styleUrls: ['crop-image.component.css']
})

export class CropImageComponent implements AfterViewInit {
  @ViewChild('modal') modal: ModalComponent;
  // @Output() imageClicked: EventEmitter<string> = new EventEmitter<string>();
  @Output() changeImageEvent: EventEmitter<any> = new EventEmitter<any>();
  @Output() doneEvent: EventEmitter<string> = new EventEmitter<string>();

  curImage: string = "";
  cropper: any = null;

  readonly DEFAULT_IMG: string = Constants.img.avatar;

  ngAfterViewInit(): void {

  }

  open(file?: any) {

    console.debug('upload crop image - open file: ', file);
    if(file !== undefined) {
      this.curImage = file;
      this.initCropper();
    }
    this.modal.open();
  }

  initCropper() {
    this.clearCropper();
    console.debug('after clear cropper: ', this.cropper);
    if (this.cropper == null) {
      console.debug('init cropper ...');
      let image = document.getElementById('image');
      this.cropper = new Cropper(image, {
        dragMode: 'none',
        // autoCrop: true,
        // autoCropArea: 0,
        // viewMode: 2,
        modal: false,
        ready: () => {
          // // hide crop area on view mode
          // $('.cropper-crop-box').hide();
        },
        cropstart: () => {
          // $('.cropper-crop-box').show();
        }
      });
    }
    this.cropper.replace(this.curImage);
  }


  rotateCropper(leftDirect: boolean) {
    this.cropper.rotate(leftDirect ? -90 : 90);
  }

  clearCropper() {
    console.debug('Clear cropper ...');
    if(this.cropper !== null) {
      this.cropper.destroy();
      this.cropper = null;
    }
  }

  done() {
    let editedData = this.cropper.getCroppedCanvas().toDataURL(this.curImage);
    // console.debug('crop image DONE: ', this.curImage, editedData);

    this.doneEvent.emit(editedData);
    this.clearCropper();
    this.modal.close();
  }

  changeImage() {
    console.debug('crop image ChangeImage');
    this.changeImageEvent.emit(null);
    this.clearCropper();
    this.modal.close();
  }
}
