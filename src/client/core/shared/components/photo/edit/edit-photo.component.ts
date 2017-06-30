import { Component, Input, OnInit, Output, AfterViewInit, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { PhotoService } from '../../../services/photo.service';
import { PhotoUploadService } from '../../../services/photo-upload.service';
import { ApiBaseService } from '../../../services/apibase.service';
import { ConfirmationService } from 'primeng/components/common/api';

declare var $: any;
declare var Cropper: any;

@Component({
  moduleId: module.id,
  selector: 'partials-photo-edit',
  templateUrl: 'edit-photo.component.html',
  styleUrls: ['edit-photo.component.css']
})
export class PhotoEditComponent implements OnInit, AfterViewInit {
  @Input() data:any = null;
  @Output() events: EventEmitter<any> = new EventEmitter<any>();

  loadingImg: boolean = true;
  imgUrl: string = 'assets/images/zone/media/photo-edit-default.png';
  img: any = null;
  imgType: string = 'jpeg';

  hasSave: boolean = true;

  myCropOptions: any = {
    viewMode: 2,
    dragMode: 'move',
    autoCropArea: 1,
    autoCrop: false
  };

  constructor(private photoService: PhotoService,
              private route: ActivatedRoute,
              private apiBaseService: ApiBaseService,
              private photoUploadService: PhotoUploadService,
              private confirmationService: ConfirmationService,
              private location: Location) {
  }

  ngOnInit() {
    this.imgUrl = this.data.url;
    this.imgType = this.data.extension;
  }

  ngAfterViewInit() {
    this.reInitPhoto();
    this.img.cropper('reset', true).cropper('replace', this.data.url);
    this.img.cropper('destroy').attr('src', this.data.url).cropper(this.myCropOptions).cropper('clear');
  }

  onBack() {
    this.location.back();
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
    // get cropped image data
    let blob = this.img.cropper('getCroppedCanvas').toDataURL();
    let extension:any;
    if (blob.indexOf("/png") !== -1) extension = "png";
    if (blob.indexOf("/jpg") !== -1) extension = "jpg";
    if (blob.indexOf("/jpeg") !== -1) extension = "jpeg";
    if (blob.indexOf("/tiff") !== -1) extension = "tiff";

    this.confirmationService.confirm({
      message: 'Do you want to save ?',
      header: 'Save Image',
      accept: () => {
        this.apiBaseService.post('media/photos', {
          name: this.data.name + `.${extension}`,
          type: `image/${extension}`,
          file: blob
        }).subscribe((res:any) => {
          this.events.emit(res);
        });
      }
    });
  }


  private reInitPhoto(): void {



    // Define variables
    let elImage = $('#photo-detail-image-edit');
    elImage.cropper();
    this.img = elImage;
  }
}
