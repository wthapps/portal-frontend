import { Http } from '@angular/http';
import { ApiBaseService } from '../apibase.service';
// import {Photo} from '../../models/photo.model';
import { Injectable } from '@angular/core';
// import {Observable} from "rxjs";
import { Album } from '../../models/album.model';

@Injectable()
export class PhotoService extends ApiBaseService {

  constructor(http: Http) {
    super(http);
  }

  addPhotosToAlbum(photos: any, album: any) {
    if (photos && album) {
      let body = JSON.stringify({
        photos: photos,
      });
      return this.post('zone/albums/' + album + '/photos', body);
    } else {
      console.log('Missing Data', 'photos album: ', photos, album);
      return;
    }
  }

  createAlbum(album: Album, callback) {
    this.customPost('zone/albums/', album, callback);
  }

  customPost(url, params, callback) {
    if (params) {
      let body = JSON.stringify(params);
      this.post('zone/albums/', body)
        .map(res => res.json())
        .map((res) => {
          if (res) {
            return res;
          }
        })
        .subscribe(res => {
          callback(res);
        }),
        error => {
          console.log(error);
        }
    } else {
      console.log('Missing Data album: ', params);
      callback([]);
    }
  }
}
