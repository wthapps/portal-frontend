import {Http} from "@angular/http";
import {ApiBaseService} from "../apibase.service";
import {Photo} from "../../models/photo.model";
import {Injectable} from "@angular/core";

@Injectable()
export class PhotoService extends ApiBaseService{

  constructor(http: Http) {
    super(http);
  }

  addPhotosToAlbum(photos:Array<Photo>, album:any) {
    this.post('zone/albums/2/photos', '[{"id": 1}, {"id": 2}, {"id": 3}]').subscribe((result: any) => {
        console.log(result);
      },
      error => {
        console.log('error');
      }
    );
  }
}
