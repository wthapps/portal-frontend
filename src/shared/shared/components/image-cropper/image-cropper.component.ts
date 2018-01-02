import {
  Component,
  OnInit,
  AfterViewInit,
  ViewEncapsulation,
  OnChanges,
  SimpleChanges,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import * as Cropper from 'cropperjs';

@Component({
  selector: 'app-image-cropper',
  templateUrl: 'image-cropper.component.html',
  styleUrls: ['image-cropper.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ImageCropperComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() photo: string;
  @Output() onCompleteMethod: EventEmitter<any> = new EventEmitter<any>();

  cropper: any;
  image: any;
  loading: boolean = true;

  data: any = {
    cropper: null,
    canvasData: null,
    cropBoxData: null,
    imageData: null,
    imageDataOrigin: null,
    type: 'jpg'
  };

  editor: any = {
    cropping: false,
    edited: false,
    zoom: 0,
    rotate: 0,
  };

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(this.photo);
    console.log('changes', changes);
    if (this.photo) {
      this.data.imageDataOrigin = this.photo;
      this.data.imageData = this.photo;
      this.stop();
    }
  }

  ngAfterViewInit() {
  }

  onStart(event?: any) {
    this.image = event ? event.path[0] : document.getElementById('image-cropper');
    // console.log('this.image:', this.image);

    this.cropper = new Cropper(this.image, {
      autoCrop: false,
      // dragMode: 'move',
      dragMode: 'none',
      background: false,
      viewMode: 1, // restrict the crop box to not exceed the size of the canvas.
      // viewMode: 2, // restrict the minimum canvas size to fit within the container.
      ready: () => {
        // console.log('ready: this.image: ', this.image);
        setTimeout(() => {
          this.loading = false;
        }, 200);
      },
      crop: (e: any) => {
        // console.log('crop:', e);
        if (e.detail.width > 0 && e.detail.height > 0 && !this.editor.cropping) {
          this.editor.cropping = true;
        }

        this.editor.rotate = e.detail.rotate;
      },
      zoom: (e: any) => {
        // console.log('zoom:', e);
        if (e.detail.ratio !== e.detail.oldRatio) {
          this.cropper.setDragMode('move');
        }
      },
    });
  }

  onCrop() {
    this.cropper.setDragMode('crop');
  }

  onZoomIn() {
    this.cropper.zoom(0.1);
    this.editor.edited = true;
  }

  onZoomOut() {
    this.cropper.zoom(-0.1);
    this.editor.edited = true;
  }

  onRotateLeft() {
    this.rotateImage(-90);
    this.editor.edited = true;

  }

  onRotateRight() {
    this.rotateImage(90);
    this.editor.edited = true;
  }

  onReset() {
    if (this.editor.edited) {
      this.editor.edited = false;
      const dataImg: any = document.getElementById('image-cropper');
      dataImg.src = this.data.imageDataOrigin;
      this.stop();
    }
  }

  onSave() {
    const imageData = this.getImageData();
    this.onCompleteMethod.emit({action: 'savePhoto', data: imageData});
  }

  onCancel() {
    this.onCompleteMethod.emit({action: 'cancelEdit'});
  }

  onCropClear() {
    if (this.editor.cropping) {
      this.cropper.clear();
      this.cropper.setDragMode('move');
      this.editor.cropping = false;
    }
  }

  onCropDone() {
    this.data.imageData = this.getImageData();
    this.editor.edited = true;
    this.stop();
  }

  private rotateImage(rotate) {
    // get data
    const cropBoxDataNew = this.cropper.getCropBoxData();
    const containerData = this.cropper.getContainerData();

    // get canvas data
    const canvasData = this.cropper.getCanvasData();

    // set data of cropbox to avoid unwanted behavior due to strict mode
    cropBoxDataNew.width = 2;
    cropBoxDataNew.height = 2;
    cropBoxDataNew.top = 0;
    const cropBoxleftNew = (containerData.width / 2) - 1;
    cropBoxDataNew.left = cropBoxleftNew;
    this.cropper.setCropBoxData(cropBoxDataNew);

    // rotate
    this.cropper.rotate(rotate);

    let heightNew = 0;
    let widthNew = 0;
    let topNew = 0;
    let leftNew = 0;

    const canvasRatioHorizontal = canvasData.width / canvasData.height;
    const canvasRatioVertical = canvasData.height / canvasData.width;

    if (canvasRatioHorizontal >= 1) {
      heightNew = containerData.height;
      widthNew = heightNew * canvasRatioVertical;
      topNew = 0;
      leftNew = (containerData.width - widthNew) / 2;
    } else {
      widthNew = containerData.width;
      heightNew = widthNew * canvasRatioHorizontal;
      topNew = (containerData.height - heightNew) / 2;
      leftNew = 0;
    }

    canvasData.height = heightNew;
    canvasData.width = widthNew;
    canvasData.top = topNew;
    canvasData.left = leftNew;

    this.cropper.setCanvasData(canvasData);

    // and now set cropper "back" to full crop
    cropBoxDataNew.left = 0;
    cropBoxDataNew.top = 0;
    cropBoxDataNew.width = canvasData.width;
    cropBoxDataNew.height = canvasData.height;
    this.cropper.setCropBoxData(cropBoxDataNew);
  }

  private getImageData() {
    const imageData = this.cropper.getCroppedCanvas(this.data.type === 'png' ? null : {
      fillColor: '#fff',
    }).toDataURL(this.data.type);
    return imageData;
  }

  private stop() {
    if (this.cropper) {
      this.loading = true;
      this.cropper.destroy();
      this.cropper = null;
      this.editor.cropping = false;
    }
  }
}
