import { Injectable } from '@angular/core';
import { ApiBaseService } from '../../core/shared/services/apibase.service';

declare var _: any;

@Injectable()
export class ZMediaAlbumService {

  url = 'zone/albums';

  constructor(private apiBaseService: ApiBaseService) {
  }

  listAlbum(body: any = {}): any {
    return this.apiBaseService.get(this.url, body);
  }

  getAlbum(id: number): any {
    return this.apiBaseService.get(`${this.url}/${id}`);
  }

  getPhotosByAlbum(id: number, shareMode?: any): any {
    let body = { 'album': id};
    if (shareMode !== undefined)
      _.merge(body, { shareMode: shareMode});
    return this.apiBaseService.get(`zone/photos`, body);
  }

  addToAlbum(id: number, selectedPhotos: any): any {
    let body = JSON.stringify({
      photos: _.map(selectedPhotos, 'id')
    });
    return this.apiBaseService.post(`${this.url}/${id}/photos`, body);
  }

  removeFromAlbum(id: number, selectedPhotos: any): any {
    let body = JSON.stringify({
      photos: _.map(selectedPhotos, 'id'),
      type: 'delete'
    });
    return this.apiBaseService.post(`${this.url}/${id}/photos`, body);
  }

  create(body: any) {
    return this.apiBaseService.post(`${this.url}`, body);
  }

  actionOneFavourite(item: any) {
    let body = JSON.stringify({
      ids: [item.id],
      setFavourite: (item.favorite) ? false : true
    });
    return this.apiBaseService.post(`${this.url}/favourite`, body);
  }

  actionAllFavourite(items: any, setFavourite: boolean) {
    let body = JSON.stringify({
      ids: _.map(items, 'id'),
      setFavourite: setFavourite
      // setFavourite: (setFavourite ? true : false) // if there was one item's favorite is false
    });
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
