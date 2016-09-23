import {Component, Input, OnInit, OnChanges} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {ZPhotoDetailComponent} from './photo-detail.component';
import {Photo} from '../../../shared/models/photo.model';
import {ApiBaseService, UserService} from '../../../shared/index';


@Component({
  moduleId: module.id,
  selector: 'page-zone-photo',
  templateUrl: 'photo.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    ZPhotoDetailComponent
  ]
})

export class ZPhotoComponent implements OnInit, OnChanges {
  @Input() listFilter: any;

  errorMessage: string = '';

  showImg: boolean = false;

  imgId: number;

  dataImages: Array<Photo> = [];

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

  ngOnChanges() {
    console.log(this.listFilter);
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

}
