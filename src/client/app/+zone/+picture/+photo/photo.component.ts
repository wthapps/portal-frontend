import {Component, Input, OnInit, OnChanges, ElementRef, AfterViewInit} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {ZPictureBarComponent} from '../shared/bar-control.component';
import {ZPictureGridComponent} from '../shared/grid.component';
import {ZPictureListComponent} from '../shared/list.component';
import {ZPhotoDetailComponent} from './photo-detail.component';
import {ToastsUploadComponent, ToastUploadingComponent} from '../toast-upload/index'
import {Photo} from '../../../shared/models/photo.model';
import {ApiBaseService, UserService} from '../../../shared/index';

declare var $: any;

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
  page: number = 1;

  dataImages: Array<Photo> = [];
  pageView: string = 'grid';

  constructor(private apiService: ApiBaseService, private userService: UserService, private el: ElementRef) {
  }

  ngOnInit() {
    this.getPhotos(this.page);
  }

  ngAfterViewInit() {
    let win = $(window);

    // Each time the user scrolls
    win.scroll(function () {
      // End of the document reached?
      if ($(document).height() - win.height() == win.scrollTop()) {
        console.log('loading');
      }
    });
    console.log(this.el);
  }

  getPhotos(page) {
    this.apiService.get(`${this.userService.profile.id}/zone/photos?page=${page}`).subscribe(
      (response: any) => {
        this.dataImages = response.data;
      },
      error => {
        this.errorMessage = <any>error;
      }
    );
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
