import { Component, OnChanges, AfterViewInit, Input, EventEmitter, Output, HostListener } from '@angular/core';
import { ZMediaService } from '../media.service';
import { Constants } from '../../../shared/index';

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

  index: number = 0;

  @HostListener('document:keydown', ['$event'])
  onKeyDown(ev: KeyboardEvent) {
    if (ev.which === KEY_ESC) this.preview(false);
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

  onAction(action: string) {
    this.outEvent.emit(action);
    return false;
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

}
