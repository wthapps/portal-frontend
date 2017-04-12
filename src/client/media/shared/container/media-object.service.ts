import { Injectable } from '@angular/core';
import { ApiBaseService } from '../../../core/shared/services/apibase.service';

declare var _: any;
const MEDIA_PATH:string = 'media';


@Injectable()
export class MediaObjectService {

  path = 'media';

  constructor(private api: ApiBaseService) {
  }

  getObjects(currentPath: string, body?: any): any {
    // switch (currentPath) {
    //   case 'photos':
    //   case 'albums':
    //     this.path = `${MEDIA_PATH}/${currentPath}`;
    //     break;
    //   case 'share-with-me':
    //   case 'favourites':
    //     this.path = `/${currentPath}`;
    //     break;
    // }

    console.log('this path', currentPath);
    this.path = `${MEDIA_PATH}/${currentPath}`;
    return this.api.get(this.path, body);
  }

  listPhoto(body: any = {}): any {
    return this.api.get(this.path, body);
  }

  actionOneFavourite(item: any) {
    let body = JSON.stringify({
      ids: [item.id],
      setFavourite: (item.favorite) ? false : true
    });
    return this.api.post(`${this.path}/favourite`, body);
  }

  actionAllFavourite(items: any, setFavourite: boolean) {
    let body = JSON.stringify({
      ids: _.map(items, 'id'),
      setFavourite: setFavourite
      // setFavourite: (setFavourite ? true : false) // if there was one item's favorite is false
    });
    return this.api.post(`${this.path}/favourite`, body);
  }

  updateInfo(id: number, body: any) {
    return this.api.put(`${this.path}/${id}`, body);
  }

  deletePhoto(body: any) {
    return this.api.post(`${this.path}/delete`, body);
  }

  loadMore(next: string): any {
    return this.api.get(next);
  }
}
