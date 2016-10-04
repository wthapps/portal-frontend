import {Component, OnInit} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {ZPictureGridComponent} from '../shared/grid.component';
import {ZPictureListComponent} from '../shared/list.component';
import {ZPhotoDetailComponent} from './photo-detail.component';
import {ToastsUploadComponent, ToastUploadingComponent} from '../toast-upload/index'
import {AddedToAlbumToast} from './toast/added-to-album-toast.component'
import {Photo} from '../../../shared/models/photo.model';
import {
  ApiBaseService,
  UserService,
  LoadingService
} from '../../../shared/index';
import {PhotoService} from "../../../shared/services/photo/photo.service";

declare var $: any;
declare var _: any;

@Component({
  moduleId: module.id,
  selector: 'page-zone-photo',
  templateUrl: 'photo.component.html',
  providers: [PhotoService],
  directives: [
    ROUTER_DIRECTIVES,
    ZPictureGridComponent,
    ZPictureListComponent,
    ZPhotoDetailComponent,
    ToastsUploadComponent,
    ToastUploadingComponent,
    // AddedToAlbumToast,
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
              private loadingService: LoadingService,
              private photoService: PhotoService) {
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

  getPhotos(page: any) {
    if (this.currentPage <= Math.ceil(this.total / this.perPage)) {
      this.loadingService.start('#photodata-loading');
      this.apiService.get(`zone/photos?page=${page}`).subscribe(
        (response: any) => {
          console.log(response);
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

  addedToAlbum($event:any) {
    console.log('parent' + $event)
  }
}
