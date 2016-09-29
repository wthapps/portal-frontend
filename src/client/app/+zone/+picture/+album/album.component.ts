import {Component, Input, OnInit, OnChanges} from '@angular/core';
import {ROUTER_DIRECTIVES} from '@angular/router';

import {ZPictureBarComponent} from '../shared/bar-control.component';
import {Album} from '../../../shared/models/album.model';
import {ApiBaseService, UserService} from '../../../shared/index';


@Component({
  moduleId: module.id,
  selector: 'page-zone-album',
  templateUrl: 'album.component.html',
  directives: [
    ROUTER_DIRECTIVES,
    ZPictureBarComponent
  ]
})

export class ZAlbumComponent implements OnInit {

  albums: Array<Album> = [];

  constructor(private apiService: ApiBaseService) {
  }

  ngOnInit() {
    this.apiService.get(`zone/albums`).subscribe(
      (response: any) => {

        this.albums = response.data;
        console.log(this.albums)
      },
      error => {

      }
    );
  }

  onPageView(view: string) {

  }

}
