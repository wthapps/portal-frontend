import {
  Component,
  AfterViewInit,
  OnDestroy,
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
  DialogService,
  LoadingService,
  ToastsService,
  Constants
} from '../../../shared/index';

declare var wheelzoom: any;
declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'zone-photo-detail',
  templateUrl: 'photo-detail.component.html'
})

export class ZonePhotoDetailComponent implements OnChanges {
  @Input() items: Array<Photo>;
  @Input() selectedItems: Array<Photo>;
  @Input() preview: boolean;

  @Output() hideModalClicked: EventEmitter<boolean> = new EventEmitter<boolean>();

  myItem: Photo;

  constructor() {
  }

  ngOnChanges() {
    if (this.selectedItems) {
      this.myItem = this.selectedItems[0];
    }
    if (this.preview) {
      $('body').addClass('fixed-hidden').css('padding-right', Constants.windows.scrollBarWidth);
      $('#photo-box-detail').addClass('active');
    }
  }

  hideModal(): void {
    this.preview = false;
    $('body').removeClass('fixed-hidden').css('padding-right', 0);
    $('#photo-box-detail').removeClass('active');
    this.hideModalClicked.emit(true);
  }
}
