import {Http} from '@angular/http';

import {Injectable} from '@angular/core';

import {Album} from '../../models/album.model';
import {ApiBaseServiceV2} from "./base.service";

@Injectable()
export class AlbumService extends ApiBaseServiceV2 {
  album:Album;

  constructor(http: Http) {
    super(http);
  }

  createAlbum(album:Album, callback:any) {
    this.postV2('zone/albums/', album, callback);
  }

  getAlbum() {
    return this.album;
  }

  setAlbum(album:Album) {
    this.album = album;
  }

  clearAlbum() {
    this.album = null;
  }

  getAlbumFromApi(albumId:number, callback:any) {
    this.get('zone/albums/' + albumId)
      .subscribe(res => {
        callback(res);
      }),
      (error:any) => {
        console.log(error);
        callback([]);
      };
  }
}
