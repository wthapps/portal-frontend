import {Http} from "@angular/http";
import {ApiBaseService} from "../apibase.service";
import {Photo} from "../../models/photo.model";
import {Injectable} from "@angular/core";

@Injectable()
export class PhotoService extends ApiBaseService{

  constructor(http: Http) {
    super(http);
  }

  addPhotosToAlbum(photos:any, album:any) {
    console.log(photos, album);
    let body = JSON.stringify({
      photos: photos,
    });
    this.post('zone/albums/'+album+'/photos', body).subscribe((result: any) => {
        console.log(result);
      },
      error => {
        console.log('error');
      }
    );
  }
}
