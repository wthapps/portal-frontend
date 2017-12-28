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
// import * as Cropper from 'cropperjs';
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
    console.log('this.image:', this.image);

    this.cropper = new Cropper(this.image, {
      autoCrop: false,
      dragMode: 'move',
      background: false,
      viewMode: 1, // restrict the crop box to not exceed the size of the canvas.
      // viewMode: 2, // restrict the minimum canvas size to fit within the container.
      ready: () => {
        console.log('ready: this.image2: ', this.image);
        setTimeout(() => {
          this.loading = false;
        }, 200);
      },
      crop: (img) => {
        if (img.detail.width > 0 && img.detail.height > 0 && !this.editor.cropping) {
          this.editor.cropping = true;
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
    this.cropper.rotate(-90);
    this.editor.edited = true;
  }

  onRotateRight() {
    this.cropper.rotate(90);
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

  /*onSave() {
    this.data.imageData = this.cropper.getCroppedCanvas(this.data.type === 'png' ? null : {
      fillColor: '#fff',
    }).toDataURL(this.data.type);
    this.editor.edited = true;
    this.stop();
    this.onCompleteMethod.emit({action: 'savePhoto', data: this.data.imageData});
  }*/

  onSave() {
    const imageData = this.cropper.getCroppedCanvas(this.data.type === 'png' ? null : {
      fillColor: '#fff',
    }).toDataURL(this.data.type);
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
    this.data.imageData = this.cropper.getCroppedCanvas(this.data.type === 'png' ? null : {
      fillColor: '#fff',
    }).toDataURL(this.data.type);
    this.editor.edited = true;
    this.stop();
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
