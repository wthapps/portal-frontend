import {
  Component,
  AfterViewInit,
  OnInit,
  Output,
  Input,
  EventEmitter,
  OnChanges
} from '@angular/core';
import { Photo } from '../../../shared/models/photo.model';

// import { ZPictureEditPhotoComponent } from '../shared/form-edit.component';


import { Constants } from '../../../shared/index';

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
  @Input() hasOpeningModal: boolean;

  @Output() hideModalClicked: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() action: EventEmitter<any> = new EventEmitter<any>();

  myItem: Photo;
  contactGroups: Array<any> = new Array<any>();
  contacts: Array<any> = new Array<any>();
  myItemsPreview: Array<Photo>;
  imgIndex: number = 0;

  modalEdit: boolean = false;

  ngOnInit() {
    this.myItem = null;
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
    // code new

    if (this.selectedItems) {
      if (this.myItem == null) {
        this.myItem = this.selectedItems[0];
      }
      if (this.selectedItems.length > 1) {
        this.myItemsPreview = this.selectedItems;
      } else {
        this.myItemsPreview = this.items;
      }
    }

    if (this.getAction) {
      switch (this.getAction) {
        case 'preview':
          this.showPreview();
          break;
        case 'info':
          this.showPreview();
          this.showInfo();
          break;
        default:
          break;
      }
      this.getAction = null;
      this.onAction(null, '');
    }
    // end code new

  }

  // code new
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

  // end code new

  onAction(even: any, type: string) {
    //this.hideModal();
    this.action.emit({
        action: type,
        currentItem: this.myItem
      }
    );
  }


  onShowEditInfo() {
    this.modalEdit = true;
  }

  onHideEditInfo() {
    this.modalEdit = false;
  }

  onPhotoUpdateInfo(item: Photo) {
    this.myItem = item;
    if (item.json_shares.length > 0) {
      this.contactGroups = item.json_shares[0].contactgroups;
      this.contacts = item.json_shares[0].contacts;
    }
  }
}
