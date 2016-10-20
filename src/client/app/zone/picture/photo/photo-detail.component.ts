import {
  Component,
  AfterViewInit,
  OnDestroy,
  OnInit,
  Output,
  Input,
  EventEmitter,
  OnChanges,
  SimpleChange
} from '@angular/core';
import { Photo } from '../../../shared/models/photo.model';

// import { ZPictureEditPhotoComponent } from '../shared/form-edit.component';


import {
  ApiBaseService,
  ConfirmationService,
  LoadingService,
  ToastsService,
  Constants
} from '../../../shared/index';

declare var wheelzoom: any;
declare var $: any;
declare var _: any;

const KEY_ESC = 27;


@Component({
  moduleId: module.id,
  selector: 'zone-photo-detail',
  templateUrl: 'photo-detail.component.html'
})

export class ZonePhotoDetailComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() items: Array<Photo>;
  @Input() selectedItems: Array<Photo>;
  @Input() preview: boolean;
  @Input() getAction: any;

  @Output() hideModalClicked: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() action: EventEmitter<any> = new EventEmitter<any>();

  myItem: Photo;
  myItemsPreview: Array<Photo>;
  imgIndex: number = 0;

  ngOnInit() {

  }

  ngAfterViewInit() {
    document.onkeyup = (e: any) => {
      if (e.which === KEY_ESC) {
        this.hideModal();
      }
    };
    let _thisPhotoDetail = this;
    $('body').on('click', '#photo-box-detail .photo-detail-img', function () {
      _thisPhotoDetail.hideModal();
    });
    $('body').on('click', '#photo-box-detail figure, .photo-detail-img-control', function (e: any) {
      e.stopPropagation();
    });
  }

  ngOnChanges() {
    if (this.selectedItems) {
      this.myItem = this.selectedItems[0];

      if (this.selectedItems.length > 1) {
        this.myItemsPreview = this.selectedItems;
      } else {
        this.myItemsPreview = this.items;
      }

    }

    if (this.getAction) {
      console.log('getAction:', this.getAction);

      switch (this.getAction) {
        case "info":
          this.showPreview();
          this.showInfo();
          break;
        default:
          break;
      }
      this.getAction = null;
      this.onAction(null, '', 0);
    }

    if (this.preview) {
      this.showPreview();
    }
  }

  showPreview(): void {
    this.imgIndex = _.findIndex(this.myItemsPreview, {'id': this.myItem.id});
    $('body').addClass('fixed-hidden').css('padding-right', Constants.windows.scrollBarWidth);
    $('#photo-box-detail').addClass('active');
  }

  hideModal(): void {
    this.preview = false;
    $('body').removeClass('fixed-hidden').css('padding-right', 0);
    $('#photo-box-detail').removeClass('active').removeClass('active-info');
    this.hideModalClicked.emit(true);

  }

  imgPrev(): void {
    this.imgIndex = this.imgIndex - 1;
    if (this.imgIndex < 0) {
      this.imgIndex = this.items.length - 1;
    }
    this.myItem = this.myItemsPreview[this.imgIndex];
  }

  imgNext(): void {
    this.imgIndex = this.imgIndex + 1;
    if (this.imgIndex == this.myItemsPreview.length) {
      this.imgIndex = 0;
    }
    this.myItem = this.myItemsPreview[this.imgIndex];
  }

  showInfo() {
    $('#photo-box-detail').toggleClass('active-info');
  }

  onAction(even: any, type: string, id: number) {
    //this.hideModal();
    this.action.emit(
      {
        action: type,
        id: id
      }
    );
  }
}
