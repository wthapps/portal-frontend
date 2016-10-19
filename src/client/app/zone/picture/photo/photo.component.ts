import { Component, OnInit, Output, Input, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { ZPictureGridComponent, ZPictureListComponent } from '../../shared/index';

// import {ZPhotoDetailComponent} from './photo-detail.component';
import { Photo } from '../../../shared/models/photo.model';
import { BaseMediaComponent } from '../../shared/index';
import {
  ApiBaseService,
  MediaType,
  LoadingService,
  ToastsService,
  ConfirmationService
} from '../../../shared/index';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'zone-photo',
  templateUrl: 'photo.component.html'
})

export class ZonePhotoComponent extends BaseMediaComponent implements OnInit {

  showImg: boolean = false;
  imgId: number;

  @Input() resetSelected: boolean;
  @Input() preview: boolean;
  @Input() viewInfo: boolean;
  @Input() hasUploadedItem: boolean;
  // @Input() deletedItems: Array<number> = [];

  @Output() selectedPhotos: EventEmitter<Array<number>> = new EventEmitter<Array<number>>();
  @Output() selectedPhotoFull: EventEmitter<Array<Photo>> = new EventEmitter<Array<Photo>>();
  @Output() modalHide: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() modalAction: EventEmitter<string> = new EventEmitter<string>();

  constructor(private apiService: ApiBaseService,
              // these are using for BaseMediaComponent
              // tslint:disable-next-line
              private toastsService: ToastsService,
              private loadingService: LoadingService,
              private confirmationService: ConfirmationService) {
    super(MediaType.photo, this.apiService);
  }

  ngOnInit() {
    super.ngOnInit();
  }

  ngOnChanges() {
    if (this.preview) {
      this.onPreview(this.selectedItems[0], this.preview);
    }
    if (this.needToReload) {
      this.items = [];
      this.loadItems(this.currentPage);
    }
    if (this.viewInfo) {
      this.onPreview(this.selectedItems[0], this.preview);
    }
  }

  onPreview(id: any, preview: boolean): void {
    this.showImg = true;
    if (preview) {
      this.previewItems = this.selectedItems;
    } else {
      this.previewItems = this.items;
    }
  }

  onHideModalClicked(img: string): void {
    if (img) {
      this.showImg = false;
      this.modalHide.emit(false);
    }
  }

  onActionModalClicked(act: string): void {
    if (act) {
      this.modalAction.emit(act);
    }
  }

  onPageView(view: string) {
    this.pageView = view;
  }

  addedToAlbum($event: any) {
  }

  onImgsSelected(event: any) {
    let _this_photos = this;
    this.selectedItems = [];
    _.map(event, function (v) {
      _this_photos.selectedItems.push(_.find(_this_photos.items, ['id', v]));
    });
    this.selectedPhotos.emit(event);
    this.selectedPhotoFull.emit(this.selectedItems);
  }

  onActionDeleteOne(id): void {
    this.showImg = false;
    this.modalHide.emit(false);
    this.items = _.dropWhile(this.items, ['id', id]);
  }

  onLoadMore(p: number) {
    this.currentPage = p;
    this.loadItems(p + 1);
  }
}
