import {Http} from '@angular/http';

import {Injectable} from '@angular/core';
import {Album} from '../../models/album.model';
import {ApiBaseServiceV2} from "./base.service";

@Injectable()
export class PhotoService extends ApiBaseServiceV2 {

  constructor(http: Http) {
    super(http);
  }

  addPhotosToAlbum(photos:any, album:any, callback:any) {
    if(photos && album) {
      this.postV2('zone/albums/'+album+'/photos', {photos: photos}, callback);
    } else {
      console.log('Missing Data', 'photos album: ', photos, album);
    }
  }
}
