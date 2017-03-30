import { Component, AfterViewInit, Input, EventEmitter, Output, HostListener, ViewChild } from '@angular/core';
import { ZMediaPhotoService } from './photo.service';

import { ZMediaPhotoFormEditComponent } from './form/form-edit-photo.component';
import { ConfirmationService } from 'primeng/components/common/api';
import { LoadingService } from '../../core/partials/loading/loading.service';
import { Constants } from '../../core/shared/config/constants';

import { ZMediaSharingComponent } from '../shared/sharing/sharing.component';
import { ZMediaToolbarComponent } from '../shared/toolbar/toolbar.component';
import { ZMediaTaggingComponent } from '../shared/tagging/tagging.component';

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

  @Input() mediaToolbar: ZMediaToolbarComponent;

  @Output() outEvent: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('formEdit') formEdit: ZMediaPhotoFormEditComponent;
  @ViewChild('zoneSharing') zoneSharing: ZMediaSharingComponent;
  @ViewChild('zoneTagging') zoneTagging: ZMediaTaggingComponent;

  index: number = 0;
  loadingImg: boolean = true;

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

    $('.photo-detail-img img').load(function () {
      if ($(this).height() > 100) {
        $(this).addClass('bigImg');
      }
    });
  }

  showLoading() {
    this.loadingImg = false;
  }

  imgPrev(): void {
    this.index = this.index - 1;
    if (this.index < 0) this.index = this.selectedPhotos.length - 1;
    this.loadingImg = true;
  }

  imgNext(): void {
    this.index = this.index + 1;
    if (this.index == this.selectedPhotos.length) this.index = 0;
    this.loadingImg = true;
  }


  actionPhoto(event: any) {
    switch (event) {
      case 'favourite':
        this.onFavourite();
        break;
      case 'share':
        this.mediaToolbar.zoneSharing.modal.open();
        break;
      case 'tag':
        this.zoneTagging.selectedItems = [this.selectedPhotos[this.index]];
        this.zoneTagging.items = this.allPhotos;
        this.zoneTagging.mediaType = 'photo';
        this.zoneTagging.openModel();
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
        console.log(this.mediaToolbar.formAddAlbum);
        this.mediaToolbar.formAddAlbum.modal.open();
        break;
      default:
        break;
    }

    return false;
  }

  preview(show: boolean): void {
    this.loadingImg = true;
    if (show) {
      $('body').addClass('fixed-hidden').css('padding-right', Constants.windows.scrollBarWidth);
      $('#photo-box-detail').addClass('active');
    } else {
      $('body').removeClass('fixed-hidden').css('padding-right', 0);
      $('#photo-box-detail').removeClass('active').removeClass('active-info');
    }
  }

  onShowInfo() {
    $('#photo-box-detail').toggleClass('active-info');
  }

  onEditInfo() {
    this.formEdit.onShow();
  }

  private onFavourite() {
    this.photoService.actionOneFavourite(this.selectedPhotos[this.index]).subscribe((res: any)=> {
      if (res.message === 'success') {
        this.selectedPhotos[this.index].favorite = (this.selectedPhotos[this.index].favorite) ? false : true;
      }
    });
  }

  private onDelete() {
    let idPhoto = this.selectedPhotos[this.index].id;
    this.confirmationService.confirm({
      message: 'Are you sure to delete 1 item?',
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
