import { Component, AfterViewInit, Input, EventEmitter, Output, HostListener, ViewChild } from '@angular/core';
import { ZMediaPhotoService } from './photo.service';

import { Constants, ConfirmationService, LoadingService } from '../../../shared/index';
import { ZMediaPhotoFormEditComponent } from './form/form-edit-photo.component';

declare var $: any;
declare var _: any;
const KEY_ESC = 27;

@Component({
  moduleId: module.id,
  selector: 'z-media-photo-detail',
  templateUrl: 'photo-detail.component.html'
})
export class ZMediaPhotoDetailComponent implements AfterViewInit {
  @Input() selectedPhotos: any = [];
  @Input() allPhotos: any = [];
  @Output() outEvent: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('formEdit') formEdit: ZMediaPhotoFormEditComponent;

  index: number = 0;

  @HostListener('document:keydown', ['$event'])
  onKeyDown(ev: KeyboardEvent) {
    if (ev.which === KEY_ESC) this.preview(false);
  }

  constructor(private photoService: ZMediaPhotoService,
              private confirmationService: ConfirmationService,
              private loadingService: LoadingService) {
  }

  ngAfterViewInit() {
    let _thisPhotoDetail = this;
    $('body').on('click', '#photo-box-detail .photo-detail-img', function () {
      _thisPhotoDetail.preview(false);
    });
    $('body').on('click', '#photo-box-detail figure, .photo-detail-img-control', function (e: any) {
      e.stopPropagation();
    });
  }

  preview(show: boolean): void {
    if (show) {
      $('body').addClass('fixed-hidden').css('padding-right', Constants.windows.scrollBarWidth);
      $('#photo-box-detail').addClass('active');
    } else {
      $('body').removeClass('fixed-hidden').css('padding-right', 0);
      $('#photo-box-detail').removeClass('active').removeClass('active-info');
    }
  }

  imgPrev(): void {
    this.index = this.index - 1;
    if (this.index < 0) this.index = this.selectedPhotos.length - 1;
  }

  imgNext(): void {
    this.index = this.index + 1;
    if (this.index == this.selectedPhotos.length) this.index = 0;
  }


  actionPhoto(event: any) {
    switch (event) {
      case 'favourite':
        this.onFavourite();
        break;
      case 'share':

        break;
      case 'tag':

        break;
      case 'delete':
        this.onDelete();
        break;
      case 'info':
        this.onShowInfo();
        break;
      case 'editInfo':
        this.onEditInfo();
        break;
      case 'addToAlbum':

        break;
      default:
        break;
    }

    return false;
  }

  private onFavourite() {
    this.photoService.actionOneFavourite(this.selectedPhotos[this.index]).subscribe((res: any)=> {
      if (res.message === 'success') {
        console.log(this);
        this.selectedPhotos[this.index].favorite = (this.selectedPhotos[this.index].favorite) ? false : true;
      }
    });
  }

  private onShowInfo() {
    $('#photo-box-detail').toggleClass('active-info');
  }

  private onEditInfo() {
    this.formEdit.onShow();
  }

  private onDelete() {
    let idPhoto = this.selectedPhotos[this.index].id;
    this.confirmationService.confirm({
      message: 'Are you sure to delete 1 item ?',
      accept: () => {
        let body = JSON.stringify({ids: [idPhoto]});
        this.loadingService.start();
        this.photoService.deletePhoto(body).subscribe((res: any)=> {
          this.preview(false);
          _.remove(this.allPhotos, ['id', idPhoto]);
          this.loadingService.stop();
        });
      }
    });
  }

}
