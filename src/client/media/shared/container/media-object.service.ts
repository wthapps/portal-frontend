import { Injectable } from '@angular/core';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';

declare var _: any;

@Injectable()
export class MediaObjectService {

  url = 'zone/photos';

  constructor(private api: ApiBaseService) {
  }

  listPhoto(body: any = {}): any {
    return this.api.get(this.url, body);
  }

  actionOneFavourite(item: any) {
    let body = JSON.stringify({
      ids: [item.id],
      setFavourite: (item.favorite) ? false : true
    });
    return this.api.post(`${this.url}/favourite`, body);
  }

  actionAllFavourite(items: any, setFavourite: boolean) {
    let body = JSON.stringify({
      ids: _.map(items, 'id'),
      setFavourite: setFavourite
      // setFavourite: (setFavourite ? true : false) // if there was one item's favorite is false
    });
    return this.api.post(`${this.url}/favourite`, body);
  }

  updateInfo(id: number, body: any) {
    return this.api.put(`${this.url}/${id}`, body);
  }

  deletePhoto(body: any) {
    return this.api.post(`${this.url}/delete`, body);
  }

  loadMore(next: string): any {
    return this.api.get(next);
  }
}
