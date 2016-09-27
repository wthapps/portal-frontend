import {Component, Input, OnInit, OnChanges, AfterViewInit} from '@angular/core';
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

  dataImages: Array<Photo> = [];
  pageView: string = 'grid';

  constructor(private apiService: ApiBaseService, private userService: UserService) {
  }

  ngOnInit() {
    this.apiService.get(`${this.userService.profile.id}/zone/photos`).subscribe(
      (response: any) => {
        this.dataImages = response.data;
      },
      error => {
        this.errorMessage = <any>error;
      }
    );
  }

  ngAfterViewInit() {
    /*var element = $("#element").offset().top;
    $(window).scroll(function () {
      var y = $(window).scrollTop();
      if (y >= element) {
        // Do stuff, like append a class to an element
      }
    });*/
  }

  onClick(id): void {
    console.log(id);
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
