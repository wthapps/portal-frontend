 import { Injectable } from '@angular/core';
 import { ApiBaseService, BaseEntityService } from '@wth/shared/services';
 import {Observable} from 'rxjs';
 import { take } from 'rxjs/operators';


 declare var _: any;
const MEDIA_PATH:string = 'media';


@Injectable()
export class MediaObjectService extends BaseEntityService<any> {

  path = 'media';
  url = 'media';
  constructor(protected api: ApiBaseService) {
    super(api);
  }

  getObjects(path: string, queryString?: any): any {
    console.log('this path', path, queryString);
    this.path = `${MEDIA_PATH}/${path}`;
    return this.api.get(this.path, queryString).pipe(take(1)); // This subscription should take 1 input ONLY
  }

  update(
    body: any,
    multiple: boolean = false,
    path: string = ''
  ): Observable<any> {
    const url = path === '' ? this.url : `${this.url}/${path}`;
    if (multiple) {
      return this.apiBaseService.put(`${url}/multiple`, body);
    } else {
      return this.apiBaseService.put(`${url}/${body.uuid}`, body);
    }
  }

  // Delete multiple objects: photos, albums
  // Allow delete photos in album (options)
  // Params format:
  //  { objects: [{id: <value>, object_type: <value>}], child_destroy: <true/false> }
  deleteObjects(objects: Array<any>, child_destroy: boolean = false) {
    let body = {objects: objects, child_destroy: child_destroy};
    return this.api.post(`${MEDIA_PATH}/media/delete`, body).pipe(take(1)); // apiBaseService does not support DELETE methods with a body parameter, so a POST method should be used
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

  favourite(body: any): any {
    return this.api.post('media/media/favourite', body);
  }

  favorite(body: any): any {
    return this.api.post('media/favorites/favorite', body);
  }

  unfavorite(body: any): any {
    return this.api.post('media/favorites/unfavorite', body);
  }

  download(body: any): any {
    return this.api.download('media/files/download', body);
  }

  getAllFavorite(queryString?: any): any {
    return this.api.get('media/favorites', queryString).pipe(take(1)); // This subscription should take 1 input ONLY
  }
}
