import { Injectable } from '@angular/core';
import { ApiBaseService } from './apibase.service';

declare var _: any;

@Injectable()
export class PhotoService {

  url = 'media/photos';

  constructor(private apiBaseService: ApiBaseService) {
  }

  listPhoto(body: any = {}): any {
    return this.apiBaseService.get(this.url, body);
  }

  getPhoto(id: any): any {
    return this.apiBaseService.get(`${this.url}/${id}`);
  }

  actionOneFavourite(item: any) {
    // let body = JSON.stringify({
    //   ids: [item.id],
    //   setFavourite: (item.favorite) ? false : true
    // });
    let body = {
      ids: [item.id],
      setFavourite: (item.favorite) ? false : true
    };
    return this.apiBaseService.post(`${this.url}/favourite`, body);
  }

  actionAllFavourite(items: any, setFavourite: boolean) {
    let body = {
      ids: _.map(items, 'id'),
      setFavourite: setFavourite
      // setFavourite: (setFavourite ? true : false) // if there was one item's favorite is false
    };
    return this.apiBaseService.post(`${this.url}/favourite`, body);
  }

  updateInfo(id: number, body: any) {
    return this.apiBaseService.put(`${this.url}/${id}`, body);
  }

  deletePhoto(body: any) {
    return this.apiBaseService.post(`${this.url}/delete`, body);
  }

  loadMore(next: string): any {
    return this.apiBaseService.get(next);
  }
}
