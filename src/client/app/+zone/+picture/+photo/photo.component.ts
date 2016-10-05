import {Component, OnInit, Output, Input, EventEmitter, SimpleChanges, OnChanges} from '@angular/core';

import {ROUTER_DIRECTIVES} from '@angular/router';

import {ZPictureGridComponent} from '../shared/grid.component';
import {ZPictureListComponent} from '../shared/list.component';
import {ZPhotoDetailComponent} from './photo-detail.component';
import {Photo} from '../../../shared/models/photo.model';
import {
  ApiBaseService,
  UserService,
  LoadingService
} from '../../../shared/index';

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'page-zone-photo',
  templateUrl: 'photo.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    ZPictureGridComponent,
    ZPictureListComponent,
    ZPhotoDetailComponent
  ]
})

export class ZPhotoComponent implements OnInit, OnChanges {
  errorMessage: string = '';

  showImg: boolean = false;

  imgId: number;
  currentPage: number = 1;
  perPage: number = 1;
  total: number = 1;

  photos: Array<Photo> = [];
  photosOfDetail: Array<Photo> = [];
  dataSelectedPhotos: Array<Photo> = [];

  isGridView: boolean;
  isListView: boolean;
  @Input() pageView: string = 'grid';
  @Input() resetSelected: boolean;
  @Input() preview: boolean;
  
  @Output() selectedPhotos: EventEmitter<Array<number>> = new EventEmitter<Array<number>>();
  @Output() modalHide: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() modalAction: EventEmitter<string> = new EventEmitter<string>();

  constructor(private apiService: ApiBaseService,
              private loadingService: LoadingService) {
  }

  ngOnInit() {

    if (this.pageView == 'grid') {
      this.isGridView = true;
      this.isListView = false;
    } else if (this.pageView == 'list') {
      this.isGridView = false;
      this.isListView = true;
    }
    this.getPhotos(this.currentPage);
  }

  ngAfterViewInit() {
    let win = $(window);
    let _this = this;

    // Each time the user scrolls
    win.scroll(function () {
      // End of the document reached?
      if ($(document).height() - win.height() == win.scrollTop()) {
        _this.currentPage = _this.currentPage + 1;
        _this.getPhotos(_this.currentPage);
      }
    });
  }

  ngOnChanges() {
    if (this.pageView) {
      if (this.pageView == 'grid') {
        this.isGridView = true;
        this.isListView = false;
      } else if (this.pageView == 'list') {
        this.isGridView = false;
        this.isListView = true;
      }
    }
    if (this.preview) {
      this.onClick(this.photos[0].id, this.preview);
    }
  }

  getPhotos(page: any) {
    if (this.currentPage <= Math.ceil(this.total / this.perPage)) {
      this.loadingService.start('#photodata-loading');
      this.apiService.get(`zone/photos?page=${page}`).subscribe(
        (response: any) => {
          this.perPage = response.per_page;
          this.total = response.total;
          this.photos = _.concat(this.photos, response.data);
          this.loadingService.stop('#photodata-loading');
        },
        error => {
          this.errorMessage = <any>error;
          this.loadingService.stop('#photodata-loading');
        }
      );
    }
  }

  onClick(id: any, preview: boolean): void {
    this.imgId = id;
    this.showImg = true;
    if (preview) {
      this.photosOfDetail = this.dataSelectedPhotos;
    } else {
      this.photosOfDetail = this.photos;
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
    this.dataSelectedPhotos = [];
    _.map(event, function (v) {
      // console.log(_this_photos.photos);
      console.log(_.find(_this_photos.photos, ['id', v]));
      _this_photos.dataSelectedPhotos.push(_.find(_this_photos.photos, ['id', v]));
    });
    this.selectedPhotos.emit(event);
  }
}
