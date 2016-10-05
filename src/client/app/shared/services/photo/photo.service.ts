import {Http} from "@angular/http";
import {ApiBaseService} from "../apibase.service";
import {Photo} from "../../models/photo.model";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {Album} from "../../models/album.model";

@Injectable()
export class PhotoService extends ApiBaseService{

  constructor(http: Http) {
    super(http);
  }

  addPhotosToAlbum(photos:any, album:any) {
    if(photos && album) {
      let body = JSON.stringify({
        photos: photos,
      });
      return this.post('zone/albums/'+album+'/photos', body);
    } else {
      console.log("Missing Data", "photos album: ", photos, album);
      return;
    }
  }

  createAlbum(album:Album) {
    if(album) {
      let body = JSON.stringify(album);
      return this.post('zone/albums/', body);
    } else {
      console.log("Missing Data album: ", album);
      return;
    }
  }
}
