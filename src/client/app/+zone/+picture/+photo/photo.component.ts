import {Component, OnInit, ElementRef} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {ZPictureBarComponent} from '../shared/bar-control.component';
import {ZPictureGridComponent} from '../shared/grid.component';
import {ZPictureListComponent} from '../shared/list.component';
import {ZPhotoDetailComponent} from './photo-detail.component';
import {ToastsUploadComponent, ToastUploadingComponent} from '../toast-upload/index'
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
    ZPictureBarComponent,
    ZPictureGridComponent,
    ZPictureListComponent,
    ZPhotoDetailComponent,
    ToastsUploadComponent,
    ToastUploadingComponent
  ]
})

export class ZPhotoComponent implements OnInit {
  errorMessage: string = '';

  showImg: boolean = false;

  imgId: number;
  currentPage: number = 1;
  perPage: number = 1;
  total: number = 1;

  dataImages: Array<Photo> = [];
  pageView: string = 'grid';

  constructor(private apiService: ApiBaseService,
              private userService: UserService,
              private loadingService: LoadingService) {
  }

  ngOnInit() {
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

  getPhotos(page) {
    if (this.currentPage <= Math.ceil(this.total / this.perPage)) {
      this.loadingService.start('#photodata-loading');
      this.apiService.get(`${this.userService.profile.id}/zone/photos?page=${page}&per_page=10`).subscribe(
        (response: any) => {
          this.perPage = response.per_page;
          this.total = response.total;
          this.dataImages = _.concat(this.dataImages, response.data);
          this.loadingService.stop('#photodata-loading');
        },
        error => {
          this.errorMessage = <any>error;
          this.loadingService.stop('#photodata-loading');
        }
      );
    }
  }

  onClick(id): void {
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

}
