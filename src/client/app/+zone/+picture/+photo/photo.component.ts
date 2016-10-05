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

  isGridView: boolean;
  isListView: boolean;
  @Input() pageView: string = 'grid';
  @Input() resetSelected: boolean;

  @Output() selectedPhotos: EventEmitter<Array<number>> = new EventEmitter<Array<number>>();

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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pageView'] != null && changes['pageView'].currentValue) {
      var view = changes['pageView'].currentValue;
      if (view == 'grid') {
        this.isGridView = true;
        this.isListView = false;
      } else if (view == 'list') {
        this.isGridView = false;
        this.isListView = true;
      }
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

  onClick(id: any): void {
    this.imgId = id;
    this.showImg = true;
  }

  onHideModalClicked(img: string): void {
    if (img) {
      this.showImg = false;
    }
  }

  onPageView(view: string) {
    this.pageView = view;
  }

  addedToAlbum($event: any) {
  }

  onImgsSelected($event: any) {
    this.selectedPhotos.emit($event);
  }
}
